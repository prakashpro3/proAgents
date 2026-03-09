# Learning Effectiveness Metrics

Track workflow adoption, improvement rates, and optimization effectiveness.

---

## Prompt Template

```
Analyze learning system effectiveness for this project:

Project: {project_name}
Period: {date_range}
Usage Data: {learning_data}

Evaluate:
1. Workflow adoption rate
2. Pattern learning accuracy
3. Suggestion acceptance rate
4. Time savings achieved
5. Error reduction rate

Compare:
- Initial baseline: {baseline}
- Current performance: {current}
- Target improvements: {targets}

Provide:
- Learning system effectiveness score
- Key improvements made
- Areas still learning
- Recommendations for optimization
```

---

## Key Metrics

### Workflow Adoption

Track how effectively the team adopts ProAgents workflows.

```yaml
adoption:
  metrics:
    active_users: "Users using workflow regularly"
    feature_utilization: "Features being used"
    workflow_completion: "Workflows completed vs started"
    checkpoint_usage: "Custom checkpoint configurations"

  targets:
    active_user_rate: "> 80%"
    feature_utilization: "> 60%"
    workflow_completion: "> 90%"
```

**Tracking:**
```typescript
interface AdoptionMetrics {
  activeUsers: {
    total: number;
    percentage: number;
    trend: 'growing' | 'stable' | 'declining';
  };
  featureUtilization: Map<string, {
    users: number;
    frequency: number;
    satisfaction: number;
  }>;
  workflowCompletion: {
    started: number;
    completed: number;
    abandoned: number;
    rate: number;
  };
}
```

**Dashboard:**
```
Workflow Adoption - Last 30 Days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Active Users: 12/15 (80%) ✅
Trend: ↑ Growing (+2 this month)

Feature Utilization:
Full Workflow:     ████████░░ 78%
Bug Fix Mode:      ██████████ 95%
Quick Change:      ███████░░░ 68%
Code Review:       █████████░ 88%
Documentation:     ██████░░░░ 55%

Workflow Completion:
Started:    156
Completed:  142
Abandoned:   14
Rate: 91% ✅

Abandonment Reasons:
- Requirements changed: 8
- Switched to quick mode: 4
- Other: 2
```

---

### Pattern Learning Accuracy

How accurately the system learns project patterns.

```yaml
pattern_learning:
  categories:
    naming_conventions: "Variable, function, file naming"
    code_style: "Formatting, structure preferences"
    architecture: "Module organization, patterns used"
    testing: "Test structure, assertion styles"

  measurement:
    accuracy: "Correct suggestions / total suggestions"
    confidence: "System confidence in patterns"
    coverage: "Patterns detected / total patterns"
```

**Analysis:**
```typescript
interface PatternLearningMetrics {
  overallAccuracy: number;
  byCategory: {
    namingConventions: { accuracy: number; coverage: number; examples: number };
    codeStyle: { accuracy: number; coverage: number; examples: number };
    architecture: { accuracy: number; coverage: number; examples: number };
    testing: { accuracy: number; coverage: number; examples: number };
  };
  recentLearnings: PatternLearning[];
  needsMoreData: string[];
}

interface PatternLearning {
  pattern: string;
  confidence: number;
  examples: number;
  lastUsed: Date;
}
```

**Report:**
```
Pattern Learning Accuracy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Accuracy: 87%

By Category:
Naming Conventions:  ████████░░ 92% (high confidence)
Code Style:          █████████░ 89% (high confidence)
Architecture:        ████████░░ 85% (medium confidence)
Testing Patterns:    ███████░░░ 78% (learning)

Recently Learned:
✓ Component naming: use{Feature}Hook pattern
✓ API calls: always use try-catch wrapper
✓ Tests: describe → it → expect structure
✓ Imports: group by external → internal → styles

Still Learning (need more examples):
• State management patterns (5 examples)
• Error handling preferences (8 examples)
• Database query patterns (3 examples)
```

---

### Suggestion Acceptance Rate

Track how often AI suggestions are accepted.

```yaml
suggestions:
  types:
    code_generation: "Generated code accepted"
    refactoring: "Refactoring suggestions accepted"
    fixes: "Bug fix suggestions accepted"
    documentation: "Doc suggestions accepted"

  tracking:
    accepted: "Used as-is or with minor edits"
    modified: "Significantly modified before use"
    rejected: "Not used"
```

**Metrics:**
```typescript
interface SuggestionMetrics {
  overallAcceptance: number;
  byType: {
    codeGeneration: { accepted: number; modified: number; rejected: number };
    refactoring: { accepted: number; modified: number; rejected: number };
    fixes: { accepted: number; modified: number; rejected: number };
    documentation: { accepted: number; modified: number; rejected: number };
  };
  trend: 'improving' | 'stable' | 'declining';
  commonRejectionReasons: Map<string, number>;
}
```

**Dashboard:**
```
Suggestion Acceptance - Last 30 Days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Rate: 74% accepted, 18% modified, 8% rejected

By Type:              Accepted  Modified  Rejected
Code Generation       ████████░░ 78%   15%      7%
Bug Fixes            █████████░ 85%   10%      5%
Refactoring          ██████░░░░ 62%   25%     13%
Documentation        ███████░░░ 71%   20%      9%

Trend: ↑ Improving (+8% vs previous month)

Common Rejection Reasons:
1. Different style preference (35%)
2. Over-engineered solution (28%)
3. Missing edge case (20%)
4. Performance concerns (12%)
5. Other (5%)

Learning Applied:
• Now suggests simpler solutions
• Better edge case handling
• Aligned with team's style guide
```

---

### Time Savings

Measure time saved through workflow automation.

```yaml
time_savings:
  baseline:
    feature_development: "Manual average time"
    bug_fixing: "Manual average time"
    code_review: "Manual average time"
    documentation: "Manual average time"

  measurement:
    actual_time: "Time with workflow"
    estimated_manual: "Estimated without workflow"
    savings: "estimated_manual - actual_time"
```

**Tracking:**
```typescript
interface TimeSavings {
  totalSaved: Duration;
  byActivity: {
    codebaseAnalysis: { saved: Duration; percentage: number };
    codeGeneration: { saved: Duration; percentage: number };
    testing: { saved: Duration; percentage: number };
    codeReview: { saved: Duration; percentage: number };
    documentation: { saved: Duration; percentage: number };
  };
  weeklyTrend: Duration[];
  projectedAnnualSavings: Duration;
}
```

**Report:**
```
Time Savings Analysis - Last 30 Days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Time Saved: 48.5 hours

By Activity:
Codebase Analysis:   ████████░░ 12h (45% reduction)
Code Generation:     ██████████ 15h (55% reduction)
Testing Setup:       ███████░░░  8h (35% reduction)
Code Review:         █████░░░░░  6h (25% reduction)
Documentation:       ███████░░░ 7.5h (40% reduction)

Weekly Trend:
Week 1:  ████████░░░░ 10h
Week 2:  ██████████░░ 12h
Week 3:  ███████████░ 13h
Week 4:  ███████████░ 13.5h

Projected Annual Savings: 582 hours
At $100/hr: $58,200 value
```

---

### Error Reduction

Track reduction in errors and rework.

```yaml
error_reduction:
  types:
    code_errors: "Bugs introduced"
    style_violations: "Linting/style issues"
    test_failures: "Tests failing on first run"
    deployment_issues: "Deployment problems"

  comparison:
    baseline_period: "Before workflow adoption"
    current_period: "With workflow"
```

**Analysis:**
```typescript
interface ErrorReduction {
  overallReduction: number;
  byType: {
    codeErrors: { baseline: number; current: number; reduction: number };
    styleViolations: { baseline: number; current: number; reduction: number };
    testFailures: { baseline: number; current: number; reduction: number };
    deploymentIssues: { baseline: number; current: number; reduction: number };
  };
  reworkReduction: {
    reviewCycles: { before: number; after: number };
    bugFixRework: { before: number; after: number };
  };
}
```

**Dashboard:**
```
Error Reduction Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Error Reduction: 42%

By Type:            Before    After    Reduction
Code Errors         8.2/week  4.1/week   -50%
Style Violations    25/week   5/week     -80%
Test Failures       12/week   6/week     -50%
Deploy Issues       3/month   1/month    -67%

Rework Reduction:
Review Cycles:      2.8 avg → 1.6 avg    -43%
Bug Fix Rework:     1.5/bug → 0.8/bug    -47%

Key Improvements:
✓ Auto-linting catches style issues
✓ Pattern learning prevents common bugs
✓ Pre-commit checks catch test failures
✓ Deployment checklists reduce issues
```

---

## Learning System Performance

### Composite Learning Score

```typescript
interface LearningScore {
  overall: number;  // 0-100
  breakdown: {
    adoption: { score: number; weight: 0.20 };
    patternAccuracy: { score: number; weight: 0.25 };
    suggestionAcceptance: { score: number; weight: 0.25 };
    timeSavings: { score: number; weight: 0.15 };
    errorReduction: { score: number; weight: 0.15 };
  };
  trend: 'improving' | 'stable' | 'declining';
  maturityLevel: 'initial' | 'developing' | 'established' | 'optimized';
}
```

**Dashboard:**
```
Learning System Effectiveness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Score: 76/100
Maturity Level: ESTABLISHED

Breakdown:
Adoption (20%):          ████████░░ 80/100
Pattern Accuracy (25%):  █████████░ 87/100
Suggestion Accept (25%): ███████░░░ 74/100
Time Savings (15%):      ███████░░░ 65/100
Error Reduction (15%):   ███████░░░ 70/100

Trend: ↑ Improving (+12 pts this quarter)

Recommendations:
1. More examples needed for testing patterns
2. Simplify refactoring suggestions
3. Add more project-specific terminology
```

---

## Configuration

```yaml
# proagents.config.yaml
metrics:
  learning:
    enabled: true

    tracking:
      adoption: true
      patterns: true
      suggestions: true
      time_savings: true
      errors: true

    baseline:
      period: "2024-01-01 to 2024-01-31"
      source: "historical_data"

    reporting:
      schedule: "monthly"
      include_recommendations: true

    privacy:
      anonymize: true
      no_code_samples: true
```

---

## Commands

```bash
# View learning dashboard
pa:metrics learning

# Adoption analysis
pa:metrics learning --adoption

# Pattern accuracy
pa:metrics learning --patterns

# Suggestion stats
pa:metrics learning --suggestions

# Time savings report
pa:metrics learning --savings

# Generate learning report
pa:metrics learning --report
```

---

## Improving Learning Effectiveness

### Increasing Adoption

1. **Onboarding**: Provide workflow tutorials
2. **Quick Wins**: Start with bug fix mode
3. **Champions**: Identify power users
4. **Feedback**: Act on user feedback

### Improving Pattern Learning

1. **Consistent Code**: Follow established patterns
2. **Examples**: Provide more training examples
3. **Corrections**: Correct AI mistakes promptly
4. **Documentation**: Document patterns explicitly

### Increasing Suggestion Acceptance

1. **Simpler Solutions**: Prefer straightforward code
2. **Style Alignment**: Match team preferences
3. **Context Awareness**: Consider project context
4. **Iteration**: Learn from rejections

### Maximizing Time Savings

1. **Full Workflow**: Use all phases consistently
2. **Automation**: Automate repetitive tasks
3. **Templates**: Create project-specific templates
4. **Shortcuts**: Learn and use quick commands
