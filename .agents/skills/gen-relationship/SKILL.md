---
name: gen-relationship
description: Generate schema-backed relationship definitions for Meshery models between given components.
tools: ['search/changes', 'search/codebase', 'edit/editFiles', 'vscode/extensions', 'web/fetch', 'web/githubRepo', 'vscode/getProjectSetupInfo', 'vscode/installExtension', 'vscode/newWorkspace', 'vscode/runCommand', 'vscode/openSimpleBrowser', 'read/problems', 'execute/getTerminalOutput', 'execute/runInTerminal', 'read/terminalLastCommand', 'read/terminalSelection', 'execute/createAndRunTask', 'execute', 'execute/runTask', 'execute/runTests', 'search', 'search/searchResults', 'execute/testFailure', 'search/usages', 'vscode/vscodeAPI', 'github/*', 'memory']
---

# Skill: gen-relationship

Generate schema-backed relationship definitions for Meshery models between given components. This skill ensures that relationships are mathematically accurate, logically sound, and strictly compliant with the canonical `v1beta3` relationship schema (`relationships.meshery.io/v1beta3`).

## Usage

Invoke this skill when you need to define a new relationship or refine an existing one between two or more components:
- `/gen-relationship Define a reference relationship between a Deployment and a PersistentVolumeClaim in the kubernetes model.`
- `/gen-relationship Create a hierarchical parent-inventory relationship between a Namespace and its child workloads.`
- `/gen-relationship Define non-binding network relationships between an AWS NATGateway and a Subnet in aws-ec2-controller.`

---

## Source of Truth

- **Upstream Integrations Spreadsheet**: The **Meshery Integrations Google Spreadsheet** is the upstream authoritative source of truth for all models, components, relationships, metadata, and icons. Any additions or modifications to relationship JSON definitions MUST be synchronized to the spreadsheet to prevent automated CI bot overwrites during the next `registry generate` cycle.
- **Canonical Schema**: `relationships.meshery.io/v1beta3` from [meshery/schemas](https://github.com/meshery/schemas).
- **Existing Definitions**: In-tree relationship JSON files under `models/<model-name>/<model-version>/<def-version>/relationships/` (e.g., `models/kubernetes/v1.32.0/v1.0.0/relationships/`).
- **Component Schemas**: In-tree component JSON files under `models/<model-name>/<model-version>/<def-version>/components/<Kind>.json`.

---

## Instructions

1. **Identify the Components**: Determine the source (`from`) and target (`to`) components. Note their `kind` and the `model` they belong to.
2. **Determine the Relationship Taxonomy**: Select the appropriate `kind`, `type`, and `subType` based on operational lifecycle semantics.
3. **Formulate Selectors**: Construct the `selectors` array with `allow` (and optional `deny`) blocks.
4. **Define Patches**: If the relationship involves data flow or configuration binding, define `mutatorRef` (source) and `mutatedRef` (sink) as nested arrays of strings (`string[][]`).
5. **Assign Metadata**: Include UI capabilities, description, and styling so the relationship renders and behaves accurately on the design canvas.
6. **Validate & Verify**: Validate against the `v1beta3` schema and execute package validation (`mesheryctl model build`).

---

## Technical Context & Taxonomy

### 1. Kind $\rightarrow$ Type $\rightarrow$ SubType Matrix

| Kind | Type | SubType | Semantic Purpose | Direction Convention |
| :--- | :--- | :--- | :--- | :--- |
| **`hierarchical`** | `parent` | `inventory` | Containment (Namespace contains Pods, VPC contains Subnets) | `from: Child` $\rightarrow$ `to: Parent` |
| **`hierarchical`** | `parent` | `wallet` | Child mutates parent (Filter config $\rightarrow$ EnvoyFilter patch) | `from: Child` $\rightarrow$ `to: Parent` |
| **`edge`** | `non-binding` | `network` | Logical network traffic flow (Service $\rightarrow$ Deployment) | `from: Service` $\rightarrow$ `to: Deployment` |
| **`edge`** | `non-binding` | `reference` | Spec field reference (Deployment references ConfigMap/Secret) | `from: Consumer` $\rightarrow$ `to: Authority` |
| **`edge`** | `binding` | `permission` | RBAC binding (RoleBinding binds Role to ServiceAccount) | `from: Consumer` $\rightarrow$ `to: Role` |
| **`edge`** | `binding` | `mount` | Volume attachment (Pod mounts PVC) | `from: Pod` $\rightarrow$ `to: PVC` |
| **`sibling`** | `matchLabels` | `sibling` | Peer association (Pod to Pod via affinity/labels) | `from: Peer` $\leftrightarrow$ `to: Peer` |

> [!IMPORTANT]
> In hierarchical containment (`inventory`), the **Child** is placed in `from` and the **Parent** is placed in `to`. The parent provides its identifier (mutator) to patch into the child's namespace/scope (mutated).

---

### 2. Actions: `mutatorRef` vs `mutatedRef`

Defined as **nested arrays of string path segments** (`string[][]`). Sequence length on both sides must match: index `i` of `mutatorRef` patches onto index `i` of `mutatedRef`.

```json
"mutatorRef": [["displayName"], ["configuration", "metadata", "name"]],
"mutatedRef": [["configuration", "spec", "subnetRef", "from", "name"], ["configuration", "spec", "subnetID"]]
```

| Field | Role | Description |
| :--- | :--- | :--- |
| **`mutatorRef`** | **Source (Authority)** | JSON path segments of the value to read from (e.g., `displayName`, `configuration.metadata.name`). |
| **`mutatedRef`** | **Sink (Consumer)** | JSON path segments of the field to patch/write into (e.g., `configuration.spec.subnetRef.from.name`). |
| **`patchStrategy`** | Strategy | How to apply. Schema enum: `replace`, `merge`, `strategic`, `add`, `remove`, `copy`, `move`, `test`. Default to `"replace"`. |

#### **Array Wildcard Rules (`_`):**
1. `"_"` is supported to match or patch elements within an array (e.g., `["configuration", "spec", "containers", "_", "image"]`).
2. `"_"` may mark **only the first** array position in a path. Deeper array levels must use an explicit integer index (`"0"`, `"1"`).
3. Do not leave trailing `"_"` wildcards if the target field itself is the array collection (e.g., use `["configuration", "spec", "subnetRefs"]`).
4. **Never** define both `mutatorRef` and `mutatedRef` simultaneously inside the same node selector.

---

### 3. Canonical Schema (`v1beta3`)

- **schemaVersion**: `relationships.meshery.io/v1beta3`
- **evaluationQuery**: `""` (Deprecated; the relationship engine dispatches automatically on taxonomy).
- **Selectors**:
  - `allow`: Array of selector pairs (`from` and `to`).
  - `deny`: (Optional) Array of selector pairs to subtract.
- **Selector Item**:
  - `kind`: The kind of the component (e.g., `Deployment`, `Subnet`, `*`).
  - `model`: Model reference object (`{ "name": "aws-ec2-controller", "registrant": { "kind": "github" } }`).
  - `patch`: Contains `mutatorRef` OR `mutatedRef` (never both on the same node).

---

## Canonical Examples

### 1. Spec Field Reference (`edge` $\rightarrow$ `non-binding` $\rightarrow$ `reference`)
**Scenario**: Deployment consumes a PersistentVolumeClaim via `claimName`.

```json
{
  "schemaVersion": "relationships.meshery.io/v1beta3",
  "kind": "edge",
  "type": "non-binding",
  "subType": "reference",
  "metadata": {
    "description": "Deployment referencing a PVC via claimName",
    "capabilities": {
      "designer": { "edit": true }
    }
  },
  "selectors": [
    {
      "allow": {
        "from": [
          {
            "kind": "Deployment",
            "model": { "name": "kubernetes", "registrant": { "kind": "github" } },
            "patch": {
              "mutatedRef": [["configuration", "spec", "template", "spec", "volumes", "0", "persistentVolumeClaim", "claimName"]],
              "patchStrategy": "replace"
            }
          }
        ],
        "to": [
          {
            "kind": "PersistentVolumeClaim",
            "model": { "name": "kubernetes", "registrant": { "kind": "github" } },
            "patch": {
              "mutatorRef": [["displayName"], ["configuration", "metadata", "name"]],
              "patchStrategy": "replace"
            }
          }
        ]
      },
      "deny": {
        "from": [],
        "to": []
      }
    }
  ],
  "status": "enabled",
  "version": "v1.0.0"
}
```

---

### 2. Hierarchical Inventory (`hierarchical` $\rightarrow$ `parent` $\rightarrow$ `inventory`)
**Scenario**: Namespace contains child workloads. Child is placed in `from`, Parent is placed in `to`.

```json
{
  "schemaVersion": "relationships.meshery.io/v1beta3",
  "kind": "hierarchical",
  "type": "parent",
  "subType": "inventory",
  "metadata": {
    "description": "Namespace-level resource containment",
    "capabilities": {
      "designer": { "edit": true }
    }
  },
  "selectors": [
    {
      "allow": {
        "from": [
          {
            "kind": "*",
            "model": { "name": "kubernetes", "registrant": { "kind": "github" } },
            "patch": {
              "mutatedRef": [["configuration", "metadata", "namespace"]],
              "patchStrategy": "replace"
            }
          }
        ],
        "to": [
          {
            "kind": "Namespace",
            "model": { "name": "kubernetes", "registrant": { "kind": "github" } },
            "patch": {
              "mutatorRef": [["displayName"], ["configuration", "metadata", "name"]],
              "patchStrategy": "replace"
            }
          }
        ]
      },
      "deny": {
        "from": [],
        "to": []
      }
    }
  ],
  "status": "enabled",
  "version": "v1.0.0"
}
```

---

### 3. Network Connectivity (`edge` $\rightarrow$ `non-binding` $\rightarrow$ `network`)
**Scenario**: Service connects to Deployment pods by matching selector labels.

```json
{
  "schemaVersion": "relationships.meshery.io/v1beta3",
  "kind": "edge",
  "type": "non-binding",
  "subType": "network",
  "metadata": {
    "description": "Service targeting deployment pods",
    "capabilities": {
      "designer": { "edit": true }
    }
  },
  "selectors": [
    {
      "allow": {
        "from": [
          {
            "kind": "Service",
            "model": { "name": "kubernetes", "registrant": { "kind": "github" } },
            "patch": {
              "mutatorRef": [["configuration", "spec", "selector"]],
              "patchStrategy": "replace"
            }
          }
        ],
        "to": [
          {
            "kind": "Deployment",
            "model": { "name": "kubernetes", "registrant": { "kind": "github" } },
            "patch": {
              "mutatedRef": [["configuration", "spec", "template", "metadata", "labels"]],
              "patchStrategy": "replace"
            }
          }
        ]
      },
      "deny": {
        "from": [],
        "to": []
      }
    }
  ],
  "status": "enabled",
  "version": "v1.0.0"
}
```

---

## Guidelines & Workflow Rules

1. **Integrations Spreadsheet Synchronization**:
   - Every relationship added or updated in a PR must also be recorded on the **Meshery Integrations Google Spreadsheet**. Direct code edits without spreadsheet updates risk being overwritten on the next automated registry generation cycle.

2. **Authoritative Mutation Direction**:
   - The authoritative resource providing the identity/value is the **`mutator`** (holds `mutatorRef`).
   - The referencing/consuming resource is the **`mutated`** target (holds `mutatedRef`).
   - **NEVER** define both `mutatorRef` and `mutatedRef` simultaneously inside the same node selector.

3. **Latest Model Version Only**:
   - Relationships must always be authored under the **latest version folder** of a model (e.g., `models/aws-ec2-controller/v1.23.0/v1.0.0/relationships/`).
   - If a PR was opened on an older version and new model versions were published during review, rebase with `master` and shift the relationship file into the latest version folder before merging.

4. **Common Mistakes to Avoid**:
   - Schema versions `v1beta1` or `core.meshery.io/v1alpha2` — wrong. Use `relationships.meshery.io/v1beta3`.
   - Putting the parent in `from` for hierarchical inventory.
   - Using `type: network` with no `subType`, or treating `inventory` as a `kind`.
   - `selector` (singular) instead of `selectors` (plural).
   - Flat string paths (`"spec.containers[0].name"`) instead of nested arrays (`[["configuration","spec","containers","_","name"]]`).
   - Unpaired mutator/mutated sequences.
   - Guessing JSON paths instead of reading the component schema.

5. **Validate and Register Protocol**:
   - **JSON Validation**: `python3 -m json.tool <file.json>`
   - **Model Package Build**: `mesheryctl model build <model>/<version> --path .`
   - **Register & Inspect**: `mesheryctl model import -f <model>-<ver>.tar` and verify via `/api/meshmodels/models/<model>/relationships` or `mesheryctl relationship view <model>`.
   - **Evaluation Verification**: POST a test design to `/api/meshmodels/relationships/evaluate` and confirm the relationship evaluates with `status: approved`.
