# 🔗 LightFunnels – AdClair Integration App  
**Seamless Integration Between LightFunnels and AdClair for Automated Order Tracking**

## 🧠 Overview  
The **LightFunnels – AdClair App** is a full-stack integration service built to automate the communication between **LightFunnels** and **AdClair**.  
Its main goal is to simplify and optimize **order tracking** by automatically sending new orders received in **LightFunnels** directly to **AdClair** via **webhooks**, where AdClair continues its processing workflow.

This integration eliminates manual data entry, reduces delays, and ensures real-time synchronization between marketing and delivery systems.

---

## ⚙️ How It Works  
1. 🛍️ **Order Received in LightFunnels**  
   - When a customer places an order on LightFunnels, a webhook event is triggered.  
2. 🔁 **Webhook Transmission**  
   - The webhook payload is sent automatically to this integration service.  
3. 🚚 **Forwarding to AdClair**  
   - The app processes and forwards the order data securely to the AdClair API.  
4. ⚡ **Automation on AdClair Side**  
   - AdClair receives the order and triggers its internal tracking, analytics, and delivery processes — fully automated.

---

## 🧩 Key Features  
- 🔗 **Seamless Integration:** Connects LightFunnels orders directly with AdClair in real time  
- ⚡ **Webhook-Based Automation:** Eliminates manual synchronization  
- 🔐 **Secure Data Handling:** Validates and sanitizes webhook payloads before transmission  
- 🧠 **Scalable Architecture:** Built to handle multiple stores and webhook sources  
- 🪄 **Error & Retry Handling:** Ensures reliable delivery of orders even if a temporary network issue occurs  

---

## 🛠️ Tech Stack  
- **Backend:** Node.js, Express  
- **Database:** MongoDB (optional, for logs or order tracking)  
- **Integrations:**  
  - LightFunnels Webhooks  
  - AdClair API  
- **Utilities:** Axios, dotenv, and other modern backend tools  

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js (v16+)  
- npm or yarn  
- Docker (optional)
