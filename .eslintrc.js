module.exports = {
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
      rules: {
        // no-debugging-utils 규칙을 비활성화 : 테스트 파일에서만 debug를 허용
        "testing-library/no-debugging-utils": "off"
      }
    }
  ]
};
