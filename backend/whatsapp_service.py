import os
import httpx
import logging

logger = logging.getLogger(__name__)

WHATSAPP_API_TOKEN = os.getenv("WHATSAPP_API_TOKEN", "").strip()
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "").strip()

async def send_whatsapp_message(to_number: str, message: str) -> dict:
    """
    Sends a WhatsApp message using the Meta Cloud API.
    If credentials are not set, it simulates the send for hackathon/demo purposes.
    """
    # Clean phone number (remove +, spaces, dashes)
    clean_number = "".join(filter(str.isdigit, to_number))
    
    if not WHATSAPP_API_TOKEN or not WHATSAPP_PHONE_NUMBER_ID:
        # ---------------------------------------------------------
        # MOCK MODE (For local dev / Hackathon without live keys)
        # ---------------------------------------------------------
        logger.info("WhatsApp API credentials missing. Using MOCK Mode.")
        print("\n" + "="*50)
        print("[MOCK WHATSAPP MESSAGE SENT]")
        print(f"To: +{clean_number}")
        print(f"Message:\n{message}")
        print("="*50 + "\n")
        return {"status": "success", "mode": "mock", "message": "Simulated message sent successfully"}

    # ---------------------------------------------------------
    # LIVE MODE (Meta WhatsApp Cloud API)
    # ---------------------------------------------------------
    url = f"https://graph.facebook.com/v17.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_API_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": clean_number,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": message
        }
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            return {"status": "success", "mode": "live", "data": data}
    except httpx.HTTPStatusError as exc:
        logger.error(f"WhatsApp API Error: {exc.response.text}")
        return {"status": "error", "error": exc.response.text}
    except Exception as e:
        logger.error(f"Failed to send WhatsApp message: {str(e)}")
        return {"status": "error", "error": str(e)}
