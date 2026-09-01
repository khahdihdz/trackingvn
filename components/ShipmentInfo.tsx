import type { TrackingResult } from "@/types/tracking";

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export default function ShipmentInfo({ result }: { result: TrackingResult }) {
  const hasParties = result.sender || result.receiver;

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Thông tin đơn</h3>
        <Row label="Mã vận đơn" value={result.trackingCode} />
        <Row label="Đơn vị vận chuyển" value={result.carrier.name} />
        <Row label="Dịch vụ" value={result.service} />
        <Row label="Ngày tạo đơn" value={result.createdAt} />
        <Row label="Cập nhật gần nhất" value={result.lastUpdated} />
        <Row label="Dự kiến giao hàng" value={result.estimatedDelivery} />
        <Row label="Ngày giao thành công" value={result.deliveredAt} />
      </div>

      {hasParties && (
        <div className="card">
          <h3 className="mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Người gửi / Người nhận</h3>
          <Row label="Người gửi" value={result.sender?.name} />
          <Row label="Địa chỉ gửi" value={result.sender?.address} />
          <Row label="Người nhận" value={result.receiver?.name} />
          <Row label="SĐT người nhận" value={result.receiver?.phone} />
          <Row label="Địa chỉ nhận" value={result.receiver?.address} />
        </div>
      )}

      <div className="card">
        <h3 className="mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Vận chuyển</h3>
        <Row label="Điểm gửi" value={result.origin} />
        <Row label="Điểm nhận" value={result.destination} />
        <Row label="Khối lượng" value={result.weight} />
        <Row label="Cước vận chuyển" value={result.shippingFee} />
        <Row label="COD" value={result.codAmount} />
      </div>
    </div>
  );
}
