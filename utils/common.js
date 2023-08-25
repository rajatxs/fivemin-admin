import { createHash } from 'crypto';
import { CLOUDINARY_CLOUD_NAME } from '../config.js';
import topics from '../data/topics.js';

/**
 * @param {string} text 
 * @param {number} len 
 */
export function truncateText(text, len = 35) {
   if (text.length > len) {
      return text.substring(0, len - 3) + '...'
   }
   return text
}

export function templateData(data = {}) {
   return {
      $CLOUDINARY_CLOUD_NAME: CLOUDINARY_CLOUD_NAME,
      ...data,
   }
}

/**
 * Returns absolute image url of cover image by given `imagePath`
 * @param imagePath - Post cover image path
 */
export function getPostCoverImageURL(imagePath) {
   return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,h_600/${imagePath}.webp`
}

/**
 * Returns absolute image url of embedded image inside post body
 * @param imagePath - Image path
 */
export function getPostEmbeddedImageUrl(imagePath) {
   return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,h_600/${imagePath}`
}

export function formatTime(time) {
   const currentTime = new Date()
   const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
   ]

   const month = months[time.getMonth()]

   if (time.getFullYear() === currentTime.getFullYear()) {
      return `${month} ${time.getDate()}`
   } else {
      return `${month} ${time.getDate()}, ${time.getFullYear()}`
   }
}

/**
 * Returns computed SHA1 hash of given `buff` in base64url string
 * @param {Buffer} buff 
 */
export function SHA1(buff) {
   const hasher = createHash('sha1');
   hasher.update(buff);
   return hasher.digest('base64url');
}

export function getTopicArray() {
   let _topics = [];

   for (let _topicId in topics) {
      let _topic = topics[_topicId];

      if (_topic.public) {
         _topics.push({ id: _topicId, name: _topic.name });
      }
   }

   return _topics;
}
