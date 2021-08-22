import { Request, Response } from "express";
import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { PostRepository } from "../../posts/repository/post.repository";
import { UserRepository } from "../../user/repository/user.repository";
import { LikeEntity } from "../entity/like.entity";

@EntityRepository(LikeEntity)
export class LikeRepository extends Repository<LikeEntity> {
  async addLike(req: Request, res: Response) {
    let { postId } = req.params;
    let { userEmail } = req.body;

    let postRepo = getCustomRepository(PostRepository);
    let post = await postRepo.findOne({ postId: postId });

    let userRepo = getCustomRepository(UserRepository);
    let user = await userRepo.findOne({ userEmail: userEmail });

    try {
      let like = new LikeEntity();
      like.post = post!;
      like.user = user!;
      await like.save();
      return res.send({
        message: "like added",
        liked: true,
      });
    } catch (error) {
      return res.send({
        message: "Something went wrong",
        liked: false,
      });
    }
  }

  async removeLike(req: Request, res: Response) {
    let { postId } = req.params;
    let { userEmail } = req.body;

    let userRepo = getCustomRepository(UserRepository);
    let user = await userRepo.findOne({ userEmail: userEmail });

    try {
      await this.createQueryBuilder("like")
        .delete()
        .from(LikeEntity)
        .where("postPostId=:postId", { postId: postId })
        .andWhere("userId=:userId", { userId: user?.id })
        .execute()
        .then((data: any) => {
          return res.send({
            message: "Like removed",
            liked: false,
          });
        });
    } catch (error) {
      return res.send({
        message: "Something went wrong",
        liked: false,
      });
    }
  }

  async isLikedByUser(req: Request, res: Response) {
    let { postId } = req.params;
    let { userEmail } = req.body;
    let userRepo = getCustomRepository(UserRepository);
    let user = await userRepo.findOne({ userEmail: userEmail });

    try {
      let isLiked =
        (await this.createQueryBuilder("like")
          .where("like.postPostId = :postId", {
            postId: postId,
          })
          .andWhere("like.userId = :id", { id: user?.id })
          .getCount()) >= 1;
      if (isLiked) {
        return res.send({
          message: "You have already liked this post",
          isLiked: true,
        });
      } else {
        return res.send({
          message: "You have not liked this post",
          isLiked: false,
        });
      }
    } catch (error) {
      console.log(error);
      return res.send({
        message: "Something went wrong",
        isLiked: false,
      });
    }
  }

  async getPostLikesCount(req: Request, res: Response) {
    let { postId } = req.params;

    try {
      let likeCount = await this.createQueryBuilder("like")
        .where("like.postPostId=:id", { id: postId })
        .getCount();
      return res.send({
        data: likeCount,
        received: true,
      });
    } catch (error) {
      return res.send({
        data: "Something went wrong",
        received: false,
      });
    }
  }
}
