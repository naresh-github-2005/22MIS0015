# Stage 1

## Base URL

/api/v1/notifications

---

## 1. Get Notifications

### GET /notifications

### Headers

Authorization: Bearer token

### Response

{
  "success": true,
  "notifications": [
    {
      "id": "1",
      "type": "Placement",
      "message": "TCS Hiring",
      "isRead": false,
      "createdAt": "2026-04-22T10:00:00Z"
    }
  ]
}

---

## 2. Mark Notification As Read

### PATCH /notifications/:id/read

### Response

{
  "success": true,
  "message": "Notification marked as read"
}

---

## 3. Delete Notification

### DELETE /notifications/:id

### Response

{
  "success": true,
  "message": "Notification deleted"
}

---

## 4. Send Notification

### POST /notifications

### Request Body

{
  "userId": "101",
  "type": "Placement",
  "message": "Amazon Hiring"
}

### Response

{
  "success": true,
  "message": "Notification sent"
}

# Stage 2

## Recommended Database

MongoDB

## Why MongoDB?

- Handles large notification volumes efficiently
- Flexible schema
- Horizontally scalable
- Faster document reads/writes
- Good for real-time notification systems

## Problems

- Huge unread notification growth
- Slow querying
- High write load

## Solutions

- Indexing
- Pagination
- Archiving old notifications
- Redis caching

## Sample Schema

{
  _id,
  studentId,
  type,
  message,
  isRead,
  createdAt
}

# Stage 3

## Why Query Is Slow

- Table contains millions of notifications
- No composite indexing
- SELECT * fetches unnecessary columns
- Sorting large data is expensive

## Better Index

(studentID, isRead, createdAt)

## Optimized Query

SELECT id, type, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;

## Why LIMIT Helps

Reduces unnecessary data fetching and sorting.

# Stage 4

## Suggested Solution

Use Redis caching.

## Why?

- Reduces repeated DB queries
- Faster notification retrieval
- Reduces database load
- Improves user experience

## Tradeoffs

Advantages:
- Very fast reads
- Lower DB traffic

Disadvantages:
- Extra infrastructure
- Cache invalidation complexity

# Stage 5

## Problems In Existing Design

- Sequential processing is slow
- Email API failure stops execution
- No retry mechanism
- Tight coupling

## Better Architecture

Use message queues.

## Suggested Flow

1. Save notification to DB
2. Push jobs to queue
3. Worker processes:
   - Email sending
   - Push notifications

## Advantages

- Reliable
- Retry support
- Scalable
- Faster execution

# Stage 6

## Priority Logic

Priority order:

1. Placement
2. Result
3. Event

If two notifications have same priority,
latest timestamp is prioritized.

## Approach

- Fetch notifications from API
- Assign priority weights
- Sort using:
  - priority
  - timestamp
- Return top 10 notifications

## Complexity

Sorting Complexity:
O(n log n)

Top 10 retrieval:
O(10)

## Scalability Improvements

- Use Min Heap for streaming notifications
- Redis caching
- Kafka event streaming
- Pagination support