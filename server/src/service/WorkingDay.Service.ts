import { prismaClient } from "../index";
import { DayName, Day } from "prisma/prisma-client";
const WorkingDayService = {
  getWorkingDayByName: async function (day: DayName) {
    try {
      const workingDay = await prismaClient.day.findUnique({
        where: {
          day: day,
        },
      });
      return workingDay;
    } catch (error) {
      throw error;
    }
  },
  attachExistingDayToNew: async function (currentDays: Day[]) {
    try {
      const days = await Promise.all(
        currentDays.map((d) => {
          return WorkingDayService.getWorkingDayByName(d.day);
        })
      );

      days.forEach((spec, idx) => {
        if (spec !== null) currentDays[idx] = spec;
      });
      return currentDays;
    } catch (error) {
      throw error;
    }
  },
};
export default WorkingDayService;
