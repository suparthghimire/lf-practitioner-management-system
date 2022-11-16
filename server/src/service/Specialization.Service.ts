import { Specialization } from "prisma/prisma-client";
import { prismaClient } from "../index";
const SpecializationService = {
  getSpecializationByName: async function (specialization: string) {
    try {
      const workingDay = await prismaClient.specialization.findUnique({
        where: {
          name: specialization,
        },
      });
      return workingDay;
    } catch (error) {
      throw error;
    }
  },
  attachExistingSpecializationToNew: async function (
    currentSpecializations: Specialization[]
  ) {
    try {
      const specializations = await Promise.all(
        currentSpecializations.map((spec) => {
          return SpecializationService.getSpecializationByName(spec.name);
        })
      );

      specializations.forEach((spec, idx) => {
        if (spec !== null) currentSpecializations[idx] = spec;
      });
      return currentSpecializations;
    } catch (error) {}
  },
};
export default SpecializationService;
