# Locker

## Lockerfile

```yaml
team: 1.0.0  # give this "version" a name

lockers:
  local: ~/Library/Caches/Locker
  s3: your-bucket-name

gear:
  directories:
    - Carthage/Build/iOS
    - Vendor
  files:
    - codecov.yml

```
