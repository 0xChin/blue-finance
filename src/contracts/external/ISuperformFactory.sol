interface ISuperformFactory {
  function createSuperform(
    uint32 formImplementationId_,
    address vault_
  ) external returns (uint256 superformId_, address superform_);
}
