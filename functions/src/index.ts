/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https'
import { Request, Response } from 'express'
import * as dotenv from 'dotenv'

// 環境変数を読み込む
dotenv.config()

// 許可するIPアドレスのリストを環境変数から取得
const ALLOWED_IPS = process.env.ALLOWED_IPS?.split(',') || []

const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers['x-forwarded-for']
  if (forwardedFor) {
    const ips = (forwardedFor as string).split(',')
    return ips[0].trim()
  }
  return req.ip ? req.ip : ''
}

// IPアドレスをチェックする関数を作成します
export const ipCheck = onRequest((req: Request, res: Response) => {
  const clientIp = getClientIp(req)

  if (ALLOWED_IPS.includes(clientIp)) {
    // 許可されたIPアドレスからのアクセスを許可します
    res.send('Access granted')
  } else {
    // 許可されていないIPアドレスからのアクセスを拒否します
    res.status(403).send('Access denied')
  }
})
