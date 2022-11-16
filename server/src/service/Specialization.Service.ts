import { Specialization } from "prisma/prisma-client";
import { prismaClient } from "../index";
const SpecializationService = {
  // get all specializations
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
  /**
   * This function first gets list of data that is in
   * schema of specialization but may or may not exist in database
   * It checks if the data is already present in the database
   * if yes, it replaces the data with the data from database
   * returns the new list of specializations
   */
  attachExistingSpecializationToNew: async function (
    currentSpecializations: Specialization[]
  ) {
    try {
      // check if specializations are present in database
      const specializations = await Promise.all(
        currentSpecializations.map((spec) => {
          return SpecializationService.getSpecializationByName(spec.name);
        })
      );
      // for every specialization from the database (if it is not null), replace it with the data from database
      specializations.forEach((spec, idx) => {
        if (spec !== null) currentSpecializations[idx] = spec;
      });
      return currentSpecializations;
    } catch (error) {
      throw error;
    }
  },
};
export default SpecializationService;
