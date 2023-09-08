// @ts-nocheck

function generateSlug(text) {
  return text
   .toLowerCase()
   .replace(/\s+/g, '-')
   .replace(/[^a-z0-9-]/g, '')
   .replace(/-+/g, '-')
   .replace(/^-|-$/g, '');
}

function onTitleChange(event) {
   const title = event.srcElement.value;
   document.getElementById('slugInput').value = generateSlug(title);
}

async function onCoverImageUpload(event) {
   const files = event.srcElement.files;
   let file;

   if (!files.length) {
      alert('No cover image selected');
      return;
   }
   file = files[0];

   if (file.size > 2 * 1024 * 1024) {
      event.srcElement.value = '';
      alert('Selected file exceeds size limit');
      return;
   }

   document.getElementById('post-cover-image-status').removeAttribute('hidden');
   event.srcElement.setAttribute('disabled', '');

   const formData = new FormData();
   formData.append('file', file);

   try {
      const response = await fetch('/post/upload/cover-image', {
         method: 'POST',
         body: formData,
      });

      const data = await response.json();

      if (response.ok) {
         document.getElementById('coverImageId').value = data.assetId;
         document.getElementById('coverImagePathInput').value = data.publicId;
         document.getElementById('post-cover-image-thumb').src = $postCoverImageURL(data.publicId);
      } else {
         console.error(data);
         alert(data.message || "Couldn't upload cover image");
      }
   } catch (error) {
      console.error('An error occurred', error);
      alert('Failed to upload cover image');
   }

   document.getElementById('post-cover-image-status').setAttribute('hidden', '');
   event.srcElement.removeAttribute('disabled');
}

function parseInputTags(event) {
   let text = event.srcElement.value;
   let tags = text.split(',');

   tags = tags
      .filter(_tag => _tag.length > 0)
      .map(_tag => {
         return _tag.trim();
      });

   event.srcElement.value = tags.join(',');
}

function parseCommaSeparatedValues(event) {
   let text = event.srcElement.value;
   let values = text.split(',');

   values = values
      .filter(_val => _val.length > 0)
      .map(_val => {
         return _val.trim();
      });

   event.srcElement.value = values.join(',');
}

function handleFormSubmission(event) {
   const form = event.target;

   let bodyContent = editor.getValue();

   if (typeof bodyContent === 'string') {
      bodyContent = bodyContent.trim();
   } else {
      bodyContent = '';
   }

   form.body.value = bodyContent;
   return true;
}

async function copyTextToClipboard(text = '') {
   try {
      await navigator.clipboard.writeText(text);
      alert("Text copied");
   } catch (error) {
      alert("Failed to copy text");
   }
}
