![](assets/locker.png)

# Locker

Locker is simple tool for syncing files and folders between your local machine and "lockers". Available lockers are:
- Amazon S3
- Local folder

## Why?

On many software projects there is a need to version large files outside of git (or other version control systems). Locker solves this problem by providing a way to version raw files and folders and store them to a shared locker. Once a version is pushed to locker other team members can pull down the exact "bundle" of dependencies to ensure everyone is using the same shared data

## Getting Started

Create a `Lockerfile` at the root of your project. This can be done manually or via the `locker init` command.

## Typical workflows

### Updating locker files

1. Update your dependencies. Add any versioned files you want to store in locker.
2. Add any new `files` or `folders` to your `Lockerfile`
3. Update the `version` field in your `Lockerfile`
4. Commit `Lockerfile` changes to git
5. Use `locker push` to push your new files

### Getting files from a locker

1. Use `locker pull` to pull down changes from your locker

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
  folders:
    - Carthage/Build/iOS
    - Vendor
  files:
    - codecov.yml
```
