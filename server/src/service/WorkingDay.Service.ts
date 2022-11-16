import { prismaClient } from "../index";
import { DayName, Day } from "prisma/prisma-client";
const WorkingDayService = {
  // get all working days from databse
  getWorkingDayByName: async function (day: DayName) {
    try {
      const workingDay = await prismaClient.day.findUnique({
        where: {
          day: day,
        },
      });
      return workingDay;
    } catch (error) {
      // error habdling is done in the controller
      throw error;
    }
  },
  /**
   * This function first gets list of data that is in
   * schema of Day but may or may not exist in database
   * It checks if the data is already present in the database
   * if yes, it replaces the data with the data from database
   * returns the new list of Days
   */
  attachExistingDayToNew: async function (currentDays: Day[]) {
    try {
      // check if specializations are present in database
      const days = await Promise.all(
        currentDays.map((d) => {
          return WorkingDayService.getWorkingDayByName(d.day);
        })
      );
      // for every specialization from the database (if it is not null), replace it with the data from database
      days.forEach((spec, idx) => {
        if (spec !== null) currentDays[idx] = spec;
      });
      return currentDays;
    } catch (error) {
      // error habdling is done in the controller
      throw error;
    }
  },
};
export default WorkingDayService;
