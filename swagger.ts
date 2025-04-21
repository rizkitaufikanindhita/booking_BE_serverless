export const swaggerDocument = {
  swagger: "2.0",
  info: {
    title: "Booking Ruang Rapat",
    version: "1.0.0",
    description: "API untuk booking ruang rapat",
  },
  paths: {
    "/api/v1/user/signup": {
      post: {
        summary: "Signup user",
        description: "Signup user baru",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    description: "nama pengguna",
                  },
                  password: {
                    type: "string",
                    description: "password pengguna",
                  },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User berhasil ditambah",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "user berhasil didaftarkan",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "error",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
