import * as yup from 'yup';

yup.addMethod<yup.StringSchema>(yup.string, 'eosName', function (message) {
  return this.matches(/(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/, {
    message:
      message ??
      'Must be up to 12 characters (a-z, 1-5, .) and cannot end with a .',
    excludeEmptyString: false,
  });
});
