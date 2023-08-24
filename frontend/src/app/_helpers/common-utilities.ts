export class CommonUtilities {
  static checkEmailValidation(email: string) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(email.toLowerCase());
  }
  static getDataObjectFromAuthToken(authToken: string): object {
    let jwt_data_base64 = authToken.split('.')[1];
    let jwt_data_converted = atob(jwt_data_base64);
    let jwt_data_object = JSON.parse(jwt_data_converted);
    return jwt_data_object;
  }
}
