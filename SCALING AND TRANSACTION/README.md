
# MongoDB Learning Project — Phase 7: Scaling & Transactions

## Overview

This phase focuses on **MongoDB scaling strategies**, **performance bottlenecks**, and **multi-document transactions**. You will understand how MongoDB behaves with large datasets, how to maintain data consistency using transactions, and how to redesign schemas for optimal performance.

---

## Objective

- Learn MongoDB’s **scaling model and limitations**
- Insert and test performance with **large datasets**
- Implement and test **multi-document transactions**
- Practice **rollback**, **atomic operations**, and **concurrency handling**
- Understand **sharding**, **index behavior under load**, and **schema redesign**

---

## Concepts

### 1. MongoDB Scaling

MongoDB scales using a **shared-nothing architecture** and offers two main scaling methods:

#### **Vertical Scaling**
- Increase CPU, RAM, or disk.
- Suitable for small to medium workloads.
- Limited by hardware constraints.

#### **Horizontal Scaling (Sharding)**
- Splits a collection across multiple machines.
- Each machine stores a “chunk” of data.
- Uses a **shard key** to distribute data.

Examples of good shard key fields:
- High cardinality  
- Even distribution  
- Frequently used in queries  

Wrong shard key → cluster imbalance → slower reads/writes.

---

### 2. Transactions in MongoDB

MongoDB supports **multi-document ACID transactions** similar to SQL.

#### Why use transactions?
- To maintain consistency when multiple collections are updated.
- Example: enrolling a student + updating the course enrollment count.

#### Transaction properties:
- **Atomicity** — all or nothing  
- **Consistency** — DB stays valid  
- **Isolation** — transactions don’t interfere  
- **Durability** — once committed, data is persistent  

#### Transaction Example
```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Enrollment.create([{ student, course }], { session });
  await Course.findByIdAndUpdate(course, { $inc: { studentCount: 1 } }, { session });

  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
}
session.endSession();
````

---

### 3. Rollback Handling

If any operation inside the transaction fails:

* MongoDB automatically restores the database to its previous state.
* Ensures **no partial data** is written.

---

### 4. Large Dataset Performance

MongoDB performance depends on:

| Factor          | Impact                                    |
| --------------- | ----------------------------------------- |
| Collection size | Larger = slower full scans                |
| Indexing        | Speeds up reads, slows down writes        |
| Schema design   | Embedding vs referencing affects size     |
| Sharding        | Helps horizontal scaling                  |
| Memory (RAM)    | Determines index and working set capacity |

Examples:

* 1000 reads on 1K dataset → fast
* 1000 reads on 1M dataset → noticeable slowdown

---

### 5. Schema Redesign

As datasets grow:

* Embedded arrays become too large (16MB limit)
* Referencing becomes necessary
* Denormalization improves read performance
* Bucketing by date or category decreases query load

Schema redesign is often required to:

* Reduce read latency
* Handle high write throughput
* Improve shard distribution

---

### 6. Collection Splitting

For very large collections, it may help to split data:

Examples:

* `logs_2024`, `logs_2025`
* `orders_pending`, `orders_completed`
* `analytics_daily`, `analytics_hourly`

This reduces:

* Index size
* Query scanning
* Locking overhead

---

### 7. Index Behavior Under Load

Under high writes:

* Indexes slow down inserts/updates because each index must also update.
* Write-heavy systems use **fewer indexes**.

Under high reads:

* Indexes significantly improve performance.

---

## Tasks

1. Insert **1000+ fake students** and **50+ courses**.
2. Query all courses with enrolled students and measure **execution time**.
3. Implement a **transaction** for:

   * Enroll a student
   * Update the course enrollment count
4. Simulate a failed transaction and observe the **rollback**.
5. Compare read/write performance for **small vs large datasets**.
6. Experiment with **shard key selection** (if using Atlas sharding).
7. Analyze slow queries and propose a **schema redesign**.
8. Split large collections into multiple smaller ones, test performance.
9. Test how indexing behaves under **high load**.
10. Write reflections on:

* MongoDB scaling limits
* when transactions are necessary
* how schema design affects big datasets

---

## Outcome

By completing Phase 7, you will:

* Understand **how MongoDB scales** with real workloads
* Know how to use **transactions** for atomic consistency
* Learn how to **measure performance** and recognize bottlenecks
* Know when sharding, embedding, or referencing is appropriate
* Gain practical experience with **schema redesign** and large datasets

---



## Example Commands

### Insert Many Fake Students

```js
db.students.insertMany([...Array(1000)].map((_, i) => ({
  name: `Student ${i+1}`,
  email: `student${i+1}@mail.com`
})));
```

### Measure Query Performance

```js
const start = Date.now();
await Course.find().populate('students');
console.log("Query time:", Date.now() - start, "ms");
```
