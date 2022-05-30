# Motivation

I just want a lightweight, insecure key-value store for the cluster to use. This will just be a way for my projects to store results to display in personal writeups.

If this pod is killed, the current data will be lost and will need to be set again.

If a project comes along that needs something more persistent, then this project should be retired.

# Spec

GET /<KEY> --> returns <VALUE> in the body
POST /<KEY>/<VALUE> --> overwrites the current value for this key, or sets it for the first time.

# Image

`wheresmycookie/simple-kv-store`
