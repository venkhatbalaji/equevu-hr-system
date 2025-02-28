from fastapi import Header, HTTPException


def verify_admin(x_admin: str = Header()):
    print(x_admin)
    if x_admin != "1":
        raise HTTPException(status_code=403, detail="Admin access required")
    return True
