# Locker

## Lockerfile

```yaml
# unique id for this bundle
version: 1.0.0

# locations to store the bundles
lockers:
  local: ~/Library/Caches/Locker
  s3: your-bucket-name

# specify the directories and files you'd like to store
gear:
  directories:
    - Carthage/Build/iOS
    - Vendor
  files:
    - codecov.yml
```
