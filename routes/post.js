import { Router } from 'express';
import { ObjectId, Binary } from 'mongodb';
import { postCollection } from '../services/db.js';
import multer from '../utils/multer.js';
import { ADMIN_ID } from '../config.js';
import { getPostCoverImageURL, SHA1, templateData, getTopicArray } from '../utils/common.js';
import { uploadFile } from '../utils/cloudinary.js';
import { postIndex } from '../utils/algolia.js';
import topics from '../data/topics.js';

const router = Router();

router.get('/new', async (req, res) => {
   res.render(
      'post/new',
      templateData({
         topics: getTopicArray(),
      })
   );
});

router.post('/new', async (req, res) => {
   let payload = {};
   let errorFlag = false,
      errorMessage = '';

   payload.title = req.body.title;
   payload.desc = req.body.desc;
   payload.slug = req.body.slug;
   payload.topic = req.body.topic;
   payload.tags = req.body.tags.split(',');
   payload.coverImageId = req.body.coverImageId;
   payload.coverImagePath = req.body.coverImagePath;
   payload.createdAt = new Date();
   payload.updatedAt = new Date();
   payload.stars = 0;
   payload.authorId = ADMIN_ID;
   payload.deleted = false;
   payload.body = new Binary(Buffer.from(req.body.body));

   if (req.body.public === '1') {
      payload.public = true;
   } else {
      payload.public = false;
   }

   try {
      const result = await postCollection().insertOne(payload);

      if (payload.public) {
         const _topic = topics[payload.topic];

         const searchRecord = {
            objectID: result.insertedId.toHexString(),
            name: payload.title,
            url: `https://fivemin.in/${payload.slug}`,
            description: payload.desc,
            tags: payload.tags,
            topic: _topic.name,
            image: getPostCoverImageURL(payload.coverImagePath),
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
         };

         await postIndex.saveObject(searchRecord).wait();
      }

      errorFlag = false;
      errorMessage = 'Post successfully created';
   } catch (error) {
      errorFlag = true;
      errorMessage = error.message || 'Something went wrong';
   }

   res.render(
      'result',
      templateData({
         error: errorFlag,
         endpoint: `/`,
         message: errorMessage,
      })
   );
});

router.get('/update/:postId', async (req, res) => {
   const postId = req.params.postId;
   let post = await postCollection().findOne({ _id: ObjectId.createFromHexString(postId) });

   res.render(
      'post/update',
      templateData({
         topics: getTopicArray(),
         post,
      })
   );
});

router.post('/update/:postId', async (req, res) => {
   const postId = req.params.postId;
   const _id = ObjectId.createFromHexString(postId);
   let payload = {};
   let errorFlag = false,
      errorMessage = '';

   payload.title = req.body.title;
   payload.desc = req.body.desc;
   payload.slug = req.body.slug;
   payload.topic = req.body.topic;
   payload.tags = req.body.tags.split(',');
   payload.coverImageId = req.body.coverImageId;
   payload.coverImagePath = req.body.coverImagePath;
   payload.updatedAt = new Date();
   payload.body = new Binary(Buffer.from(req.body.body));

   if (req.body.public === '1') {
      payload.public = true;
   } else {
      payload.public = false;
   }

   try {
      await postCollection().updateOne({ _id }, { $set: payload });

      if (payload.public) {
         const _doc = await postCollection().findOne({ _id }, { projection: { body: false } });
         
         if (_doc) {
            const _topic = topics[_doc.topic];
            const searchRecord = {
               objectID: postId,
               name: _doc.title,
               url: `https://fivemin.in/${_doc.slug}`,
               description: _doc.desc,
               tags: _doc.tags,
               topic: _topic.name,
               image: getPostCoverImageURL(_doc.coverImagePath),
               createdAt: _doc.createdAt,
               updatedAt: _doc.updatedAt,
            };
      
            await postIndex.saveObject(searchRecord).wait();
         }

      } else {
         await postIndex.deleteObject(postId).wait();
      }

      errorFlag = false;
      errorMessage = 'Page successfully saved';
   } catch (error) {
      errorFlag = true;
      errorMessage = error.message || 'Something went wrong';
   }

   res.render(
      'result',
      templateData({
         error: errorFlag,
         endpoint: `/post/update/${postId}`,
         message: errorMessage,
      })
   );
});

router.post('/upload/cover-image', multer.single('file'), async (req, res) => {
   if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
   }

   const hash = SHA1(req.file.buffer);
   const publicId = `fivemin-prod/post-cover-images/${hash}`;

   try {
      const result = await uploadFile(req.file.buffer, 'image', publicId);

      if (result) {
         return res.status(201).json({
            assetId: result.asset_id,
            publicId: result.public_id,
         });
      } else {
         return res.status(500).json({
            message: "Couldn't get result",
         });
      }
   } catch (error) {
      return res.status(500).json({
         message: "Coudln't upload file",
      });
   }
});

export default router;
