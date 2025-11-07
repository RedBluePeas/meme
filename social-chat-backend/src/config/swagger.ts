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
      Comment: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          postId: {
            type: 'string',
            format: 'uuid',
          },
          userId: {
            type: 'string',
            format: 'uuid',
          },
          content: {
            type: 'string',
          },
          parentId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
          },
          likesCount: {
            type: 'integer',
            example: 0,
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
    '/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: '刷新访问令牌',
        description: '使用刷新令牌获取新的访问令牌',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: {
                    type: 'string',
                    description: '刷新令牌',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '刷新成功',
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
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: '获取当前用户信息',
        description: '获取当前登录用户的详细信息',
        security: [{ bearerAuth: [] }],
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
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
        },
      },
    },
    '/auth/change-password': {
      post: {
        tags: ['Auth'],
        summary: '修改密码',
        description: '修改当前用户密码',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['oldPassword', 'newPassword'],
                properties: {
                  oldPassword: {
                    type: 'string',
                    description: '旧密码',
                  },
                  newPassword: {
                    type: 'string',
                    minLength: 6,
                    description: '新密码',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '修改成功',
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
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
    '/posts/{postId}': {
      get: {
        tags: ['Posts'],
        summary: '获取动态详情',
        description: '根据动态ID获取详细信息',
        parameters: [
          {
            name: 'postId',
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
                      $ref: '#/components/schemas/Post',
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
      put: {
        tags: ['Posts'],
        summary: '更新动态',
        description: '更新已发布的动态内容',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
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
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '更新成功',
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
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: '删除动态',
        description: '删除指定的动态',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'postId',
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
            description: '删除成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
    },
    '/posts/{postId}/like': {
      post: {
        tags: ['Posts'],
        summary: '点赞动态',
        description: '对指定动态进行点赞',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'postId',
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
            description: '点赞成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: '取消点赞',
        description: '取消对指定动态的点赞',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'postId',
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
            description: '取消成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
    },
    '/posts/{postId}/favorite': {
      post: {
        tags: ['Posts'],
        summary: '收藏动态',
        description: '收藏指定动态',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'postId',
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
            description: '收藏成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: '取消收藏',
        description: '取消收藏指定动态',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'postId',
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
            description: '取消成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
    },
    '/posts/{postId}/share': {
      post: {
        tags: ['Posts'],
        summary: '分享动态',
        description: '分享指定动态',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'postId',
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
            description: '分享成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
    },
    '/posts/{postId}/comments': {
      get: {
        tags: ['Comments'],
        summary: '获取动态评论列表',
        description: '获取指定动态的所有评论',
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
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
                            $ref: '#/components/schemas/Comment',
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
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
      post: {
        tags: ['Comments'],
        summary: '创建评论',
        description: '对指定动态发表评论',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 500,
                  },
                  parentId: {
                    type: 'string',
                    format: 'uuid',
                    description: '父评论ID（用于回复评论）',
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
                      $ref: '#/components/schemas/Comment',
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
    },
    '/comments/{commentId}': {
      delete: {
        tags: ['Comments'],
        summary: '删除评论',
        description: '删除指定评论',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'commentId',
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
            description: '删除成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
    },
    '/comments/{commentId}/like': {
      post: {
        tags: ['Comments'],
        summary: '点赞评论',
        description: '对指定评论进行点赞',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'commentId',
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
            description: '点赞成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
        },
      },
      delete: {
        tags: ['Comments'],
        summary: '取消点赞评论',
        description: '取消对指定评论的点赞',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'commentId',
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
            description: '取消成功',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
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
