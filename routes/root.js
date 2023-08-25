import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { postCollection } from '../services/db.js';
import { truncateText, getPostCoverImageURL, formatTime, templateData } from '../utils/common.js';
import postRoutes from './post.js';
import topics from '../data/topics.js';
import _ from 'lodash';

const router = Router();

router.get('/', async (req, res) => {
   const sortProperty = req.query.sort?.toString() || 'createdAt';
   const sortOrder = req.query.order || 'desc';
   const deletePostId = String(req.query.delete || '');
   const restorePostId = String(req.query.restore || '');
   const scopeName = req.query.scope || 'public';
   let dbFilter = {};

   let sort = {
      [sortProperty]: sortOrder,
   };

   if (deletePostId.length > 0) {
      await postCollection().updateOne(
         { _id: ObjectId.createFromHexString(deletePostId) }, 
         {$set: { deleted: true }},
      );
   }

   if (restorePostId.length > 0) {
      await postCollection().updateOne(
         { _id: ObjectId.createFromHexString(restorePostId) }, 
         {$set: { deleted: false }},
      );
   }

   switch (scopeName) {
      case 'public':
      default:
         dbFilter = { public: true, deleted: false };
         break;

      case 'private':
         dbFilter = { public: false, deleted: false };
         break;

      case 'deleted':
         dbFilter = { deleted: true };
         break;
   }

   let posts = await postCollection()
      .find(dbFilter, { projection: { body: 0 } })
      .limit(12)
      // @ts-ignore
      .sort(sort)
      .toArray();

   posts = posts.map((_post) => {
      _post.coverImageUrl = getPostCoverImageURL(_post.coverImagePath);

      if (topics[_post.topic]) {
         _post.topicName = topics[_post.topic].name;
      } else {
         _post.topicName = 'Other';
      }
      _post.updatedTime = formatTime(_post.updatedAt);
      _post.desc = truncateText(_post.desc, 78);
      return _post;
   });

   res.render(
      'index',
      templateData({
         sortProperty,
         sortOrder,
         scopeName,
         posts: _.chunk(posts, 3),
      })
   );
});

router.use('/post', postRoutes);

export default router;
