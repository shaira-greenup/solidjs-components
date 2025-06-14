# Layouts Overview

## Workflow

1. Create a template with
    1. Semi-Opaque (e.g. `bg-red-500/50 border border-red-600`)
    2. JS Only
2. Once Happy with layout migrate to `peer-checked` (see note `0006371beb4341b4295286d204c768fc`)
    - Only migrate to `peer-checked` if this isn't a JS application, the code will be harder to follow
3. Create a polished template demonstrating how that can look
4. Create a ready to go Directory where that template can be pulled from

## This Structure

- `layout_examples/<Descr>`
    - Overview
        - Links to a Repo with a Template ready to go corresponding to step 4
        - Describes the:
            - Purpose for creating it
            - Goals of Template
            - Intended Usage
    - Sandbox
        - This corresponds to steps 1 and 2
    - Polished
        - This corresponds to Steps 4

- `layout_examples/no_js/<Descr>`
    - Similar to above, however, these layouts may be used without any JS, ideal for online content.
    - None of these are finished yet
