export const paymentSuccessful = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: Arial, sans-serif;
      background: #FFFFFF;
    }
    .message-box {
      background: #AFDA8E;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #FD6C23;
    }
    p {
      font-size: 18px;
    }
    .btn {
      margin-top: 1rem;
      display: inline-block;
      padding: 10px 20px;
      background: #FD6C23;
      color: #fff;
      border: none;
      border-radius: 4px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="message-box">
    <h1>Payment Successful!</h1>
    <p>Your transaction has been completed successfully.</p>
    <a class="btn" href="http://localhost:5173">Go Home</a>
  </div>
</body>
</html>`;

