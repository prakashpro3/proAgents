# ADR-0001: Use PostgreSQL for Primary Database

## Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2024-01-15 |
| **Author** | @tech-lead |
| **Reviewers** | @architect, @senior-dev, @dba |
| **Tags** | database, infrastructure, data |

---

## Context

Our application has grown beyond the capabilities of our current SQLite database. We're experiencing:

- Slow query performance with 10M+ records
- Limited concurrent connection support
- No support for advanced features like full-text search
- Inability to scale horizontally

We need to choose a production-grade database that can:
- Handle our current scale (10M records, 1000 req/s)
- Scale to 10x our current load
- Support complex queries and joins
- Provide reliability and data integrity
- Integrate with our Node.js backend

The team has varying experience with different database systems, but most are familiar with SQL-based databases.

---

## Decision

We will migrate from SQLite to **PostgreSQL** as our primary database.

Specifically:
- Use **Amazon RDS for PostgreSQL** for managed hosting
- Start with **db.m5.large** instance (2 vCPU, 8 GB RAM)
- Enable **Multi-AZ** for high availability
- Use **read replicas** for read-heavy workloads
- Implement connection pooling with **PgBouncer**

---

## Rationale

PostgreSQL was chosen because:

1. **Performance**: PostgreSQL handles complex queries efficiently with its sophisticated query planner and indexing options.

2. **Scalability**: Supports read replicas, table partitioning, and connection pooling for horizontal scaling.

3. **Features**: Offers JSON support, full-text search, and advanced data types we need.

4. **Reliability**: ACID compliance, proven track record for data integrity.

5. **Ecosystem**: Excellent Node.js support via `pg` and `prisma`, plus tools like pgAdmin.

6. **Team Knowledge**: Two team members have production PostgreSQL experience.

7. **Managed Options**: AWS RDS provides automated backups, patching, and failover.

---

## Consequences

### Positive

- **10x query performance improvement** for complex joins and aggregations
- **Better concurrency** with MVCC and proper connection pooling
- **Full-text search** without external dependencies
- **JSON support** for flexible schema evolution
- **Automated ops** with RDS (backups, patching, monitoring)
- **High availability** with Multi-AZ deployment

### Negative

- **Migration effort**: Estimated 2 weeks for data migration and testing
- **Operational cost**: ~$150/month for RDS vs $0 for SQLite
- **Complexity increase**: New infrastructure to manage and monitor
- **Learning curve**: Some team members unfamiliar with PostgreSQL specifics

### Neutral

- SQL syntax is similar, minimal code changes needed
- Existing ORM (Prisma) supports PostgreSQL

---

## Alternatives Considered

### Alternative 1: MySQL

**Description:** Another popular open-source relational database.

**Pros:**
- Wide adoption, lots of resources
- Good performance for simple queries
- Lower memory footprint

**Cons:**
- Weaker support for complex queries
- Less sophisticated query planner
- Limited JSON functionality

**Why not chosen:** PostgreSQL's superior query optimizer and JSON support better match our needs for complex analytics queries.

### Alternative 2: MongoDB

**Description:** Document-oriented NoSQL database.

**Pros:**
- Flexible schema
- Easy horizontal scaling
- Good for document-heavy workloads

**Cons:**
- Requires denormalization of our relational data
- No transactions across documents (until recently)
- Team has minimal MongoDB experience

**Why not chosen:** Our data model is inherently relational. Migrating to MongoDB would require significant data model changes and team training.

### Alternative 3: Amazon DynamoDB

**Description:** Fully managed NoSQL database service.

**Pros:**
- Fully managed, zero ops
- Excellent scaling
- Pay-per-use pricing

**Cons:**
- Limited query flexibility
- No SQL support
- Complex pricing model
- Requires complete application rewrite

**Why not chosen:** The query limitations and required application changes make this unsuitable for our use case.

### Alternative 4: Do Nothing (Keep SQLite)

**Description:** Continue using SQLite with optimizations.

**Pros:**
- No migration effort
- Zero operational cost
- Simple deployment

**Cons:**
- Performance issues will worsen
- Cannot support concurrent writes well
- Missing features we need

**Why not chosen:** SQLite cannot meet our current needs, let alone scale for future growth.

---

## Implementation

### Approach

We will perform a phased migration:
1. Set up PostgreSQL infrastructure
2. Migrate schema and data
3. Run both databases in parallel
4. Validate data consistency
5. Switch traffic to PostgreSQL
6. Decommission SQLite

### Phases

1. **Phase 1: Infrastructure Setup** (Week 1)
   - Provision RDS instance
   - Set up VPC and security groups
   - Configure PgBouncer
   - Set up monitoring

2. **Phase 2: Schema Migration** (Week 1)
   - Convert SQLite schema to PostgreSQL
   - Set up Prisma for PostgreSQL
   - Update connection strings
   - Test queries locally

3. **Phase 3: Data Migration** (Week 2)
   - Export data from SQLite
   - Transform and import to PostgreSQL
   - Validate data integrity
   - Set up ongoing sync

4. **Phase 4: Parallel Running** (Week 2)
   - Write to both databases
   - Read from PostgreSQL
   - Monitor for discrepancies
   - Performance testing

5. **Phase 5: Cutover** (Week 2)
   - Switch all traffic to PostgreSQL
   - Monitor closely for 48 hours
   - Keep SQLite as backup

6. **Phase 6: Cleanup** (Week 3)
   - Remove SQLite code
   - Remove dual-write logic
   - Document new architecture

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data loss during migration | Low | Critical | Full backups, validation scripts |
| Performance regression | Medium | High | Load testing before cutover |
| Extended downtime | Low | High | Parallel running phase |
| Query compatibility issues | Medium | Medium | Early testing, Prisma abstraction |

---

## Validation

### Success Criteria

- [ ] All queries execute in < 500ms (p99)
- [ ] Zero data loss verified by row count and checksum comparison
- [ ] Application handles 2000 req/s in load testing
- [ ] 99.9% uptime maintained during migration
- [ ] No increase in application error rate

### Metrics to Track

- Query latency (p50, p95, p99)
- Connection pool utilization
- Database CPU and memory usage
- Replication lag (for read replicas)
- Application error rate

### Review Date

This decision will be reviewed on 2024-04-15 (3 months after implementation) to assess:
- Performance improvements achieved
- Operational burden
- Any unforeseen issues

---

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- Internal RFC: Database Evaluation (link)
- Performance benchmarks (link)

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2024-01-10 | @tech-lead | Initial draft |
| 2024-01-12 | @tech-lead | Updated based on architecture review |
| 2024-01-15 | @tech-lead | Status changed to Accepted |
