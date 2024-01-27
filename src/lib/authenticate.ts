import { NextRequest } from "next/server";

export default function authenticate(request: NextRequest){
    const ipCheck = JSON.parse(process.env.IP_WHITELIST!).includes(request.headers.get("X-FORWARDED-FOR"));
    const tokenCheck = request.headers.get("X-API-TOKEN") && request.headers.get("X-API-TOKEN") === process.env.ACCESS_TOKEN;
    return ipCheck && tokenCheck;
}