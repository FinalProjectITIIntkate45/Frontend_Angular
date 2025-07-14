# نظام الإشعارات المتكامل

## نظرة عامة

تم تطوير نظام إشعارات متكامل يجمع بين الإشعارات المباشرة (SignalR) والإشعارات القديمة (API) في واجهة موحدة.

## المكونات

### 1. خدمة SignalR (الإشعارات المباشرة)
- **الملف**: `notification.service.service.ts`
- **الوظيفة**: استقبال الإشعارات المباشرة من الخادم
- **الميزات**:
  - اتصال مباشر مع SignalR Hub
  - استقبال الإشعارات في الوقت الفعلي
  - إدارة الاتصال وإعادة الاتصال التلقائي

### 2. خدمة API (الإشعارات القديمة)
- **الملف**: `api-notification.service.ts`
- **الوظيفة**: إدارة الإشعارات المخزنة في قاعدة البيانات
- **الميزات**:
  - جلب جميع الإشعارات للمستخدم
  - تحديد الإشعار كمقروء
  - حذف إشعار محدد
  - حذف جميع الإشعارات
  - تحديث الإشعارات من الخادم

### 3. مكون الإشعارات
- **الملف**: `notification.component.ts`
- **الوظيفة**: عرض ودمج الإشعارات من كلا المصدرين
- **الميزات**:
  - عرض الإشعارات المباشرة والقديمة معاً
  - ترتيب الإشعارات حسب التاريخ
  - تمييز الإشعارات غير المقروءة
  - أزرار للتفاعل مع الإشعارات

## نقاط النهاية API

### جلب الإشعارات
```
GET /api/Notification/my
```

### تحديد كمقروء
```
PATCH /api/Notification/{id}/mark-read
```

### حذف إشعار محدد
```
DELETE /api/Notification/{id}
```

### حذف جميع الإشعارات
```
DELETE /api/Notification/clear
```

## كيفية الاستخدام

### في المكون
```typescript
import { ApiNotificationService } from '../../Services/api-notification.service';

constructor(
  private apiNotificationService: ApiNotificationService
) {}

// تحميل الإشعارات
this.apiNotificationService.loadNotifications();

// تحديد كمقروء
this.apiNotificationService.markNotificationAsRead(notificationId);

// حذف إشعار
this.apiNotificationService.deleteNotificationById(notificationId);

// حذف جميع الإشعارات
this.apiNotificationService.clearAllNotifications();
```

### الاشتراك في الإشعارات
```typescript
this.apiNotificationService.notifications$.subscribe(
  notifications => {
    // التعامل مع الإشعارات
  }
);
```

## أنواع الإشعارات

### NotificationType
- `Order`: إشعارات الطلبات
- `Payment`: إشعارات الدفع
- `System`: إشعارات النظام
- `Offer`: إشعارات العروض
- `Auction`: إشعارات المزادات

### NotificationStatus
- `Unread`: غير مقروء
- `Read`: مقروء

## التصميم والواجهة

### الميزات البصرية
- تمييز الإشعارات غير المقروءة بلون مختلف
- أيقونات مختلفة لكل نوع إشعار
- شارة "مباشر" للإشعارات القادمة من SignalR
- أزرار تفاعلية للقراءة والحذف
- عداد الإشعارات غير المقروءة

### الاستجابة
- تصميم متجاوب للهواتف والأجهزة اللوحية
- تحسين الأداء مع الإشعارات الكثيرة
- رسوم متحركة سلسة

## الأمان

- استخدام التوكن للمصادقة
- التحقق من صلاحيات المستخدم
- حماية نقاط النهاية API

## استكشاف الأخطاء

### مشاكل الاتصال
```typescript
// التحقق من حالة الاتصال
if (!this.apiNotificationService.getCurrentNotifications()) {
  console.log('لا توجد إشعارات محملة');
}
```

### مشاكل SignalR
```typescript
// إعادة الاتصال
this.notificationService.connect();
```

## التطوير المستقبلي

- إضافة إشعارات push للمتصفح
- دعم الإشعارات الصوتية
- تصفية الإشعارات حسب النوع
- حفظ تفضيلات الإشعارات
- دعم الإشعارات المجدولة 