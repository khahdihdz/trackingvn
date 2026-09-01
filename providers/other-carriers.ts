import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

// Các DVVC nội địa nhỏ hơn — pattern mã vận đơn chung chung, độ ưu tiên nhận diện thấp nhất.
const GENERIC_PATTERN = /^[A-Z0-9]{8,20}$/;

export const express247Provider: TrackingProvider = makeUnavailableProvider({
  id: "247express",
  name: "247Express",
  detectPattern: GENERIC_PATTERN,
  officialUrl: (code) => `https://247post.vn/tra-cuu?code=${encodeURIComponent(code)}`,
  reason: "Chưa xác minh được nguồn tracking công khai ổn định.",
});

export const nhatTinProvider: TrackingProvider = makeUnavailableProvider({
  id: "nhattin",
  name: "Nhất Tín Logistics",
  detectPattern: GENERIC_PATTERN,
  officialUrl: (code) => `https://nhattinlogistics.vn/tra-cuu-don-hang?code=${encodeURIComponent(code)}`,
  reason: "Chưa xác minh được nguồn tracking công khai ổn định.",
});

export const longVanProvider: TrackingProvider = makeUnavailableProvider({
  id: "longvan",
  name: "Long Vân",
  detectPattern: GENERIC_PATTERN,
  officialUrl: (code) => `https://longvan.net/tra-cuu?code=${encodeURIComponent(code)}`,
  reason: "Chưa xác minh được nguồn tracking công khai ổn định.",
});

export const nascoExpressProvider: TrackingProvider = makeUnavailableProvider({
  id: "nasco",
  name: "Nasco Express",
  detectPattern: GENERIC_PATTERN,
  officialUrl: (code) => `https://nasco.vn/tra-cuu?code=${encodeURIComponent(code)}`,
  reason: "Chưa xác minh được nguồn tracking công khai ổn định.",
});
