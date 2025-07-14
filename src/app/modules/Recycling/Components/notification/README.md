image.png# نظام الإشعارات المتكامل

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

---

## **اقتراح تصميم عصري للإشعار:**

- استخدم كارد (بطاقة) لكل إشعار مع ظل خفيف.
- اجعل الرسالة بارزة.
- الحالة تظهر كـ Badge (شارة) ملونة (مثلاً: غير مقروءة = أزرق، مقروءة = رمادي).
- التاريخ بخط صغير أسفل الرسالة.
- زر "تعليم كمقروء" يكون أيقونة أو زر صغير بجانب الحالة.

---

### **1. عدل الـ HTML:**

```html
<div *ngFor="let notification of notifications" class="notification-card">
  <div class="notification-header">
    <span class="notification-status" [ngClass]="{
      'unread': notification.status === 1,
      'read': notification.status === 2,
      'archived': notification.status === 3
    }">
      {{ getStatusText(notification.status) }}
    </span>
    <button *ngIf="notification.status === 1" class="mark-read-btn" (click)="markNotificationAsRead(notification)" title="تعليم كمقروء">
      <i class="fas fa-check"></i>
    </button>
  </div>
  <div class="notification-message">{{ notification.message }}</div>
  <div class="notification-date">{{ notification.createdAt | date:'short' }}</div>
</div>
```

---

### **2. أضف CSS حديث (في notification.component.css):**

```css
.notification-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
  margin-bottom: 16px;
  padding: 16px 20px;
  transition: box-shadow 0.2s;
  position: relative;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.notification-status {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.9em;
  margin-left: 10px;
  color: #fff;
  font-weight: bold;
}

.notification-status.unread {
  background: #007bff;
}
.notification-status.read {
  background: #6c757d;
}
.notification-status.archived {
  background: #343a40;
}

.mark-read-btn {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin-left: 5px;
  transition: background 0.2s;
  box-shadow: 0 1px 4px #0001;
}
.mark-read-btn:hover {
  background: #0056b3;
}

.notification-message {
  font-size: 1.1em;
  margin-bottom: 6px;
  color: #222;
}

.notification-date {
  font-size: 0.85em;
  color: #888;
  text-align: left;
} 