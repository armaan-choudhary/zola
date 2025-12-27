# Constellation Logic Report

This document outlines the algorithm used to generate the constellation lines connecting stars in the ZOLA sky. The logic ensures a visually pleasing, organic, and fully connected graph structure that resembles a celestial constellation.

## 1. Input Data
The algorithm accepts an array of `star` objects. Each star contains:
- `id`: Unique identifier (string or number).
- `pos_x`: Horizontal position (percentage 0-100).
- `pos_y`: Vertical position (percentage 0-100).

## 2. Edge Generation & Weighting
The first step creates a list of all possible connections (edges) between every pair of stars.

### Distance Calculation
For every pair of stars $(A, B)$, the Euclidean distance is calculated:
$$ \text{dist} = \sqrt{(A_x - B_x)^2 + (A_y - B_y)^2} $$

### Deterministic Jitter
To create a unique yet consistent "organic" feel, a pseudo-random jitter is applied to the distance.
- A hash is generated from the combined IDs of the two stars.
- This hash modifies the distance slightly (e.g., $0.85 \times$ to $1.15 \times$).
- **Purpose**: This ensures that even if two pairs of stars are equidistant, the algorithm consistently prefers one over the other based on their identity, preventing flickering or ambiguous layouts.

## 3. Minimum Spanning Tree (MST) Construction
The edges are sorted by their weighted distance in ascending order. The algorithm then iterates through this sorted list to select edges, effectively implementing a variation of **Kruskal's Algorithm**.

### Union-Find Data Structure
A disjoint-set (Union-Find) data structure tracks connected components of stars. This allows efficient checking of whether two stars are already connected directly or indirectly.

### Constraints (Style Rules)
Unlike a standard MST, this algorithm imposes aesthetic constraints to prevent "messy" webs:
1.  **Cycle Prevention**: An edge is only considered if it connects two currently disconnected components. This ensures the result is a Tree (no loops).
2.  **Degree Limit**: The algorithm restricts the number of lines connected to a single star (degree).
    -   **Max Degree**: Generally, a star can have at most **3** connections.
    -   **Single Hub Rule**: The algorithm enforces that only **one** star in the entire constellation can act as a "hub" (degree = 3). All other stars are limited to degree 2 (forming lines/paths).
    -   If adding an edge would violate these rules, it is skipped *during this phase*.

## 4. Connectivity Enforcement
After the initial pass with strict aesthetic constraints, the graph might still be fragmented (multiple disconnected clusters).

To guarantee a single cohesive constellation:
1.  The algorithm checks if multiple disconnected components remain.
2.  If so, it searches for the shortest remaining edge that connects two separate components.
3.  **Override**: It adds this bridging edge **regardless of degree constraints**.
4.  This repeats until all stars form a single connected component.

## Summary
The result is a **Single Connected Tree** that:
-   Prioritizes short connections (nearest neighbors).
-   Maintains a clean, linear aesthetic by limiting branching.
-   Is fully deterministic (same stars always yield the same lines).
