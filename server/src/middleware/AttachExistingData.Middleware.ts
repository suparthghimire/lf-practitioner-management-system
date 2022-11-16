import { Request, Response, NextFunction } from "express";
import { Day, Specialization } from "prisma/prisma-client";
import { string } from "zod";
import SpecializationService from "../service/Specialization.Service";
import WorkingDayService from "../service/WorkingDay.Service";

export default async function AttachExistingData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { Specializations, WorkingDays } = req.body;
    if (!Specializations) req.body.Specializations = [];

    let newSpecialization: Specialization[] = [];

    let newWorkingDays: Day[] = [];

    let unresolvedAttachedSpecializations: Promise<
      Specialization[] | undefined
    > = Promise.resolve() as unknown as Promise<Specialization[] | undefined>;
    let unresolvedAttachedWorkingDays: Promise<Day[] | undefined> =
      Promise.resolve() as unknown as Promise<Day[] | undefined>;

    if (Specializations) {
      newSpecialization = Specializations.map(
        (spec: { id: string; name: string }) => ({
          id: parseInt(spec.id),
          name: spec.name,
        })
      );
      unresolvedAttachedSpecializations =
        SpecializationService.attachExistingSpecializationToNew(
          newSpecialization
        );
    }
    if (WorkingDays) {
      newWorkingDays = WorkingDays.map((day: { id: string; day: string }) => ({
        id: parseInt(day.id),
        day: day.day,
      }));
      unresolvedAttachedWorkingDays =
        WorkingDayService.attachExistingDayToNew(newWorkingDays);
    }

    const [attachedSpecializations, attachedWorkingDays] = await Promise.all([
      unresolvedAttachedSpecializations,
      unresolvedAttachedWorkingDays,
    ]);
    if (attachedSpecializations)
      req.body.Specializations = attachedSpecializations;
    if (attachedWorkingDays) req.body.WorkingDays = attachedWorkingDays;

    next();
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: 422,
      message: "Error while parsing Specialization and Working Days",
    });
  }
}
