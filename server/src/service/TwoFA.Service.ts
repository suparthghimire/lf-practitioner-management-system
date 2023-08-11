import spearkeasy from "speakeasy";
import { prismaClient } from "..";
import { T_TwoFaUserType, T_TwoFaVerifyUserType } from "../models/TwoFA";
import PractitionerService from "./Practitioner.Service";
import UserService from "./User.Service";
import QrCode from "qrcode";
import {
  Practitioner,
  PractitionerTwoFA,
  User,
  UserTwoFA,
} from "@prisma/client";
import { CustomError } from "./Error.Service";

const TwoFaService = {
  generate: async (data: T_TwoFaUserType) => {
    const tempSecret = spearkeasy.generateSecret();
    const qrImage = await QrCode.toDataURL(tempSecret.otpauth_url ?? "");
    if (data.type === "practitioner") {
      // check for practitioner email and password. if ewrror, throws
      const practitioner = await PractitionerService.authenticate(
        data.email,
        data.password
      );
      if (practitioner.PractitionerTwoFA)
        return await prismaClient.practitionerTwoFA.update({
          where: {
            id: practitioner.PractitionerTwoFA.id,
          },
          data: {
            verified: false,
            secret: tempSecret.base32,
            qrImage,
          },
        });

      return await prismaClient.practitionerTwoFA.create({
        data: {
          practitionerId: practitioner.id,
          secret: tempSecret.base32,
          qrImage,
        },
        include: {
          practitioner: true,
        },
      });
    } else if (data.type === "user") {
      // check for user email and password. if error, throws

      const user = await UserService.getUserByEmailPwd(
        data.email,
        data.password
      );
      // if user has 2fa, update the 2fa and set verified to false
      if (user.UserTwoFA) {
        return await prismaClient.userTwoFA.update({
          where: {
            id: user.UserTwoFA.id,
          },
          data: {
            verified: false,
            secret: tempSecret.base32,
            qrImage,
          },
        });
      }
      return await prismaClient.userTwoFA.create({
        data: {
          userId: user.id,
          secret: tempSecret.base32,
          qrImage,
        },
        include: {
          user: true,
        },
      });
    }
  },
  verify: async (data: T_TwoFaVerifyUserType) => {
    let twoFa: UserTwoFA | PractitionerTwoFA | null = null;

    console.log("DATA", data);

    if (data.type === "practitioner") {
      // check for practitioner email and password. if ewrror, throws
      const practitioner = await PractitionerService.authenticate(
        data.email,
        data.password
      );

      twoFa = await prismaClient.practitionerTwoFA.findFirst({
        where: {
          practitionerId: practitioner.id,
        },
      });
    } else if (data.type === "user") {
      // check for user email and password. if error, throws
      const user = await UserService.getUserByEmailPwd(
        data.email,
        data.password
      );
      twoFa = await prismaClient.userTwoFA.findFirst({
        where: {
          userId: user.id,
        },
      });
    }
    // check for user email and password. if error, throws

    if (!twoFa) throw new CustomError("2FA not found", 404);

    console.log("VERIFYING", {
      savedSecret: twoFa.secret,
      token: data.token,
      incomingSecret: data.secret,
      test: twoFa.secret === data.secret,
    });

    const verified = spearkeasy.totp.verify({
      secret: twoFa.secret,
      token: data.token,
      encoding: "base32",
    });
    if (!verified) throw new CustomError("Invalid Token 2FA", 400);
    // udpate the 2fa and set verrified to true

    if (data.type === "user")
      await prismaClient.userTwoFA.update({
        where: {
          id: twoFa.id,
        },
        data: {
          verified: true,
        },
      });
    else if (data.type === "practitioner")
      await prismaClient.practitionerTwoFA.update({
        where: {
          id: twoFa.id,
        },
        data: {
          verified: true,
        },
      });

    return twoFa;
  },
  delete: async (data: T_TwoFaUserType) => {
    if (data.type === "user") {
      const user = await UserService.getUserByEmailPwd(
        data.email,
        data.password
      );

      const user2Fa = await prismaClient.userTwoFA.findFirst({
        where: {
          userId: user.id,
        },
      });
      if (!user2Fa) throw new CustomError("2FA not found", 404);
      await prismaClient.userTwoFA.delete({
        where: {
          id: user2Fa.id,
        },
      });
    } else if (data.type === "practitioner") {
      const practitioner = await PractitionerService.authenticate(
        data.email,
        data.password
      );
      const practitionerTwoFA = await prismaClient.practitionerTwoFA.findFirst({
        where: {
          practitionerId: practitioner.id,
        },
      });
      if (!practitionerTwoFA) throw new CustomError("2FA not found", 404);
      await prismaClient.practitionerTwoFA.delete({
        where: {
          id: practitionerTwoFA.id,
        },
      });
    }
  },
  deleteMany: (data: T_TwoFaVerifyUserType) => {
    if (data.type === "user") {
    }
  },
};

export default TwoFaService;
