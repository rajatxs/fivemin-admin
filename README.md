> :warning: **Warning**
>
> The Fivemin Admin has been replaced by the [Fivemin Console](https://github.com/rajatxs/go-fconsole).

# Fivemin Admin

This project provides interface to manage content on [Fivemin](https://www.fivemin.in) platform.

## Requirements

- [Node.js 18](https://nodejs.org/en/download)

## Installation

1. Clone the repository:

```shell
git clone https://github.com/rajatxs/fivemin-admin.git fivemin-admin
```

2. Change directory to the cloned repository:

```shell
cd fivemin-admin
```

3. Install the required dependencies:

```shell
npm install
```

4. Set the following environment variables to your system:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| ```FM_ADMIN_ENV``` | Server environment | No | `development` |
| ```FM_ADMIN_PORT``` | Server Port | Yes | - |
| ```FM_ADMIN_ID``` | Admin account Id | Yes | - |
| ```FM_ADMIN_DB_URL``` | [MongoDB Connection URL](https://www.mongodb.com) | Yes | - |
| ```FM_ADMIN_DB_NAME``` | [MongoDB Database Name](https://www.mongodb.com) | Yes | - |
| ```FM_ADMIN_CLD_NAME``` | [Cloudinary Public ID](https://cloudinary.com) | Yes | - |
| ```CLOUDINARY_URL``` | [Cloudinary URL](https://cloudinary.com) | Yes | - |
| ```FM_ALGOLIA_APP_ID``` | [Algolia App ID](https://algolia.com) | Yes | - |
| ```FM_ALGOLIA_API_KEY``` | [Algolia API Key](https://algolia.com) | Yes | - |

## Usage

Start development server:

```shell
npm run dev
```

For more information or inquiries, please contact the project owner: Rajat (rxx256@outlook.com)
