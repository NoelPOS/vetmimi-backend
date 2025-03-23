import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const getAuthUser = async (request) => {
  try {
    const token = request.cookies.get("access_token")?.value;
    console.log("token", token);
    if (!token) {
      NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
  } catch (error) {
    throw error;
  }
};

export const withAuth = async (request, handler) => {
  try {
    const user = await getAuthUser(request);
    return handler(request, user);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Unauthorized" },
      { status: error.statusCode || 401 }
    );
  }
};
