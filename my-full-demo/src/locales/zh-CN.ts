export default {
  common: {
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加'
  },
  user: {
    register: {
      success: '注册成功',
      usernameExists: '用户名已存在',
      invalidUsername: '用户名格式不正确',
      invalidPassword: '密码长度不能少于6位'
    },
    login: {
      success: '登录成功',
      invalidCredentials: '用户名或密码错误',
      userNotFound: '用户不存在'
    },
    info: {
      success: '获取用户信息成功',
      userNotFound: '用户不存在'
    }
  },
  agent: {
    greeting: '你好！我是智能助手，有什么可以帮您的？',
    notUnderstand: '抱歉，我不太理解您的问题，请换个说法试试。',
    processing: '正在处理您的请求，请稍候...'
  },
  skill: {
    calculator: {
      result: '计算结果：{{expression}} = {{result}}',
      invalidExpression: '表达式无效，请输入正确的数学表达式'
    }
  }
};
