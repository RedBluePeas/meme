export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: '社交聊天应用 API',
    version: '1.0.0',
    description: '社交聊天应用后端 RESTful API 文档',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: '开发环境',
    },
    {
      url: 'https://api.example.com/api',
      description: '生产环境',
    },
  ],
  tags: [
    { name: 'Auth', description: '认证相关接口' },
    { name: 'Users', description: '用户管理接口' },
    { name: 'Posts', description: '动态管理接口' },
    { name: 'Comments', description: '评论管理接口' },
    { name: 'Friends', description: '好友管理接口' },
    { name: 'Notifications', description: '通知管理接口' },
    { name: 'Messages', description: '消息管理接口' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT 认证，格式：Bearer <token>',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 400,
          },
          message: {
            type: 'string',
            example: '错误信息',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          username: {
            type: 'string',
            example: 'testuser',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
          nickname: {
            type: 'string',
            example: '测试用户',
          },
          avatar: {
            type: 'string',
            nullable: true,
            example: 'https://example.com/avatar.jpg',
          },
          bio: {
            type: 'string',
            nullable: true,
            example: '这是一段个人简介',
          },
          followersCount: {
            type: 'integer',
            example: 100,
          },
          followingCount: {
            type: 'integer',
            example: 50,
          },
          postsCount: {
            type: 'integer',
            example: 20,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Post: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          userId: {
            type: 'string',
            format: 'uuid',
          },
          type: {
            type: 'string',
            enum: ['text', 'image', 'video'],
          },
          content: {
            type: 'string',
            nullable: true,
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          likesCount: {
            type: 'integer',
            example: 10,
          },
          commentsCount: {
            type: 'integer',
            example: 5,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Message: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          conversationId: {
            type: 'string',
            format: 'uuid',
          },
          senderId: {
            type: 'string',
            format: 'uuid',
          },
          type: {
            type: 'string',
            enum: ['text', 'image', 'video', 'file', 'audio'],
          },
          content: {
            type: 'string',
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['sent', 'delivered', 'read'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: '未授权 - Token 无效或已过期',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              code: 401,
              message: '未授权，请先登录',
            },
          },
        },
      },
      NotFoundError: {
        description: '资源未找到',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              code: 404,
              message: '资源不存在',
            },
          },
        },
      },
      ValidationError: {
        description: '参数验证失败',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              code: 400,
              message: '参数验证失败',
            },
          },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: '用户注册',
        description: '创建新用户账号',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password', 'nickname'],
                properties: {
                  username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 50,
                    example: 'testuser',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'user@example.com',
                  },
                  phone: {
                    type: 'string',
                    example: '13800138000',
                  },
                  password: {
                    type: 'string',
                    minLength: 6,
                    example: 'Test123456!',
                  },
                  nickname: {
                    type: 'string',
                    maxLength: 50,
                    example: '测试用户',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: '注册成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'integer',
                      example: 201,
                    },
                    message: {
                      type: 'string',
                      example: '注册成功',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          $ref: '#/components/schemas/User',
                        },
                        accessToken: {
                          type: 'string',
                        },
                        refreshToken: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: '用户登录',
        description: '使用用户名/邮箱/手机号和密码登录',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identifier', 'password'],
                properties: {
                  identifier: {
                    type: 'string',
                    description: '用户名、邮箱或手机号',
                    example: 'testuser',
                  },
                  password: {
                    type: 'string',
                    example: 'Test123456!',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '登录成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'integer',
                      example: 200,
                    },
                    message: {
                      type: 'string',
                      example: '登录成功',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          $ref: '#/components/schemas/User',
                        },
                        accessToken: {
                          type: 'string',
                        },
                        refreshToken: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: '用户登出',
        description: '退出登录，清除 token',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: '登出成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
        },
      },
    },
    '/users/{userId}': {
      get: {
        tags: ['Users'],
        summary: '获取用户信息',
        description: '根据用户ID获取用户详细信息',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: '成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'integer',
                      example: 200,
                    },
                    data: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
    },
    '/posts': {
      post: {
        tags: ['Posts'],
        summary: '创建动态',
        description: '发布新的动态内容',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type'],
                properties: {
                  type: {
                    type: 'string',
                    enum: ['text', 'image', 'video'],
                  },
                  content: {
                    type: 'string',
                  },
                  images: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                  visibility: {
                    type: 'string',
                    enum: ['public', 'friends', 'private'],
                    default: 'public',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: '创建成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'integer',
                      example: 201,
                    },
                    data: {
                      $ref: '#/components/schemas/Post',
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
        },
      },
      get: {
        tags: ['Posts'],
        summary: '获取动态列表',
        description: '获取动态流',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              default: 1,
            },
          },
          {
            name: 'pageSize',
            in: 'query',
            schema: {
              type: 'integer',
              default: 20,
            },
          },
        ],
        responses: {
          '200': {
            description: '成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'integer',
                      example: 200,
                    },
                    data: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Post',
                          },
                        },
                        total: {
                          type: 'integer',
                        },
                        page: {
                          type: 'integer',
                        },
                        pageSize: {
                          type: 'integer',
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
    },
    '/messages/conversations': {
      get: {
        tags: ['Messages'],
        summary: '获取会话列表',
        description: '获取用户的所有会话',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              default: 1,
            },
          },
          {
            name: 'pageSize',
            in: 'query',
            schema: {
              type: 'integer',
              default: 20,
            },
          },
        ],
        responses: {
          '200': {
            description: '成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
        },
      },
    },
  },
};
