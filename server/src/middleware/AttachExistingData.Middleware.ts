import { Request, Response, NextFunction } from "express";
import { Day, Specialization } from "prisma/prisma-client";
import SpecializationService from "../service/Specialization.Service";
import WorkingDayService from "../service/WorkingDay.Service";

/**
 * This middleware will parse the Specialization and WorkingDay from the request
 * It will fetch if any specialization or working day is present in the database
 * If yes, it will replace those data woth data from database
 */
export default async function AttachExistingData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { Specializations, WorkingDays } = req.body;
    if (!Specializations) req.body.Specializations = [];

    // variable that will store final attached data of specializations
    let newSpecialization: Specialization[] = [];

    // variable that will store final attached data of workingDays
    let newWorkingDays: Day[] = [];

    type SpecsPromise = Promise<Specialization[] | undefined>;
    type WorkDayPromise = Promise<Day[] | undefined>;

    //variables to hold promises as they can run together and then we can await them together
    let unresolvedSpecs: SpecsPromise =
      Promise.resolve() as unknown as SpecsPromise;
    let unresolvedWorkDays: WorkDayPromise =
      Promise.resolve() as unknown as WorkDayPromise;

    // if specialization is present in request body
    if (Specializations) {
      // loop through all the specializations and parse them to fit the Specialization Schema
      newSpecialization = Specializations.map(
        (spec: { id: string; name: string }) => ({
          id: parseInt(spec.id),
          name: spec.name,
        })
      );
      // Fetches the replaced data from database of specializations
      unresolvedSpecs =
        SpecializationService.attachExistingSpecializationToNew(
          newSpecialization
        );
    }
    // if WOrkingDays is present in request body
    if (WorkingDays) {
      // loop through all the working days and parse them to fit the WorkingDay Schema
      newWorkingDays = WorkingDays.map((day: { id: string; day: string }) => ({
        id: parseInt(day.id),
        day: day.day,
      }));
      // Fetches the replaced data from database of working days
      unresolvedWorkDays =
        WorkingDayService.attachExistingDayToNew(newWorkingDays);
    }

    // await for all the promises to resolve
    const [attachedSpecializations, attachedWorkingDays] = await Promise.all([
      unresolvedSpecs,
      unresolvedWorkDays,
    ]);
    // if attachedSpecializations is present, replace the Specializations in request body with attachedSpecializations
    if (attachedSpecializations)
      req.body.Specializations = attachedSpecializations;
    // if attachedWorkingDays is present, replace the WorkingDays in request body with attachedWorkingDays
    if (attachedWorkingDays) req.body.WorkingDays = attachedWorkingDays;

    // call next middleware
    next();
  } catch (error) {
    // return faiure
    console.log(error);
    return res.status(422).json({
      status: 422,
      message: "Error while parsing Specialization and Working Days",
    });
  }
}
