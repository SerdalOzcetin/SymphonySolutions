export default class CacheModuleAPI {
  private totalElements: number;
  private createdPostId: number;

  getTotalElements() {
    return this.totalElements;
  }

  setTotalElements(totalElements: number) {
    this.totalElements = totalElements;
  }
  getCreatedPostId() {
    return this.createdPostId;
  }

  setCreatedPostId(createdPostId: number) {
    this.createdPostId = createdPostId;
  }
}
