import Feedback from "../models/feedback.js";
import { sendMail } from "../Services/MailSender.js";
import { Request, Response } from "express";

const feedbackController = async (req: Request, res: Response) => {
  const name = req.body.name;
  const email = req.body.email;
  const feedback = req.body.feedback;
  const rating = req.body.rating;

  try {
    const newfeedback = await Feedback.create({
      name: name,
      email: email,
      feedback: feedback,
      rating: rating,
    });

    if (newfeedback) {
      const sendingMail = await sendMail(req, res);

      if (sendingMail) {
        res.status(200).json({
          message: "Mail sent successfully",
          name: name,
          email: email,
        });
        return;
      }
    }
  } catch (error) {
    console.error(`Error creating the feedback: ${error}`);
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

export default feedbackController;
