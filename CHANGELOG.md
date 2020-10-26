# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Handle duplicate `Device._key` and add logging to support debugging

## 0.3.1 2020-10-23

### Fixed

- Creating device user entity & relationship failed when the device does not
  have an associated user

## 0.3.0 2020-10-22

### Changed

- Migrate to latest SDK

### Fixed

- A couple entities were missing properties required by the data model
- Pagination would make unnecessary final call to figure out when to stop
