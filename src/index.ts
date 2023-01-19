import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getXataClient, User } from "./xata";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const xata = getXataClient();

type MyResponse<T> =
  | {
      err: string;
    }
  | { data: T };

// GET request
app.get(
  "/api/users",
  async (req: Request, res: Response<MyResponse<User[]>>) => {
    try {
      const users = await xata.db.User.getAll();
      res.status(200).json({ data: users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: "something went wrong" });
    }
  }
);

// POST request
app.post(
  "/api/users",
  async (req: Request<{}, {}, User>, res: Response<MyResponse<User>>) => {
    try {
      const user = req.body;
      const createdUser = await xata.db.User.create(user);
      return res.status(201).json({ data: createdUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: "something went wrong" });
    }
  }
);

// PUT/UPDATE request
app.put(
  "/api/users/:id",
  async (
    req: Request<{ id: string }, {}, User>,
    res: Response<MyResponse<User>>
  ) => {
    try {
      const id = req.params.id;
      const user = req.body;
      const updatedUser = await xata.db.User.update(id, user);

      if (!updatedUser) {
        return res.status(404).json({ err: "User not found" });
      }

      return res.status(200).json({ data: updatedUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: "something went wrong" });
    }
  }
);

// DELETE request
app.delete(
  "/api/users/:id",
  async (
    req: Request<{ id: string }, {}, {}>,
    res: Response<MyResponse<User>>
  ) => {
    try {
      const id = req.params.id;
      const deletedUser = await xata.db.User.delete(id);

      if (!deletedUser) {
        return res.status(404).json({ err: "USer not found" });
      }
      return res.status(200).json({ data: deletedUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: "something went wrong" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
