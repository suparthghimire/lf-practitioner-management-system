import { Request, Response } from "express";
const PractitionerController = {
  index: (req: Request, res: Response) =>
    res.status(200).json({ message: "Index Endpoint" }),
  post: (req: Request, res: Response) =>
    res.status(201).json({ message: "Post Endpoint" }),
  show: (req: Request, res: Response) =>
    res.status(200).json({ message: "Show Endpoint" }),
  update: (req: Request, res: Response) =>
    res.status(201).json({ message: "Update Endpoint" }),
  delete: (req: Request, res: Response) =>
    res.status(201).json({ message: "Delete Endpoint" }),
};
export default PractitionerController;
