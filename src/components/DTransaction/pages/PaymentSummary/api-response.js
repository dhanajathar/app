export default {
  "user" : {
    "name": "",
    "role": "CSR"
  },
  "feesDetails": [
      {
          "agencyObjectCode": 3005,
          "description": "New ID Card Fee",
          "feescomputed": 20,
          "feestobecollected": 20
      }
  ],
  "personalDetails": {
      "fullname": "Jonny Doe",
      "gender": "Male",
      "dob": "23-Sep-1990",
      "height": "118cm",
      "weight": "88kg",
      "address": "test",
      "email": "test@test.com",
      "mobile": "+1 233423423432"
  },
  "paymentMethods" : [
      { 
        "id": "cashPay",
        "name": "Cash" 
      },
        { "id": "checkPay",
        "name": "Check" 
      },
      {
        "id": "moneyOrder",
        "name": "Money Order"
      },
      { 
        "id": "reverseATM",
        "name": "Reverse ATM"
      },{
        "id": "voucherPay",
        "name": "Voucher"
      },
      { 
        "id": "creditCard",
        "name": "Credit Card"
      }, 
      {
        "id": "googlePay",
        "name": "Google Pay"
      },
      { 
        "id": "applePay",
        "name": "Apple Pay"
      }
  ],
  "interruptReason": ["Other"],
  "reviewPrintURL" : "",
  "selectedPaymentMethod": ["Cash","Check"],
  "paymentSummary": {
    "changeDue": "",
    "changeReturned": 0.0,
    "balanceDue":""
  }
}