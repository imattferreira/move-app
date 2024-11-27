import validateCpf from "../src/validateCpf";

it("should validate a CPF with a digit different of zero", () => {
  // Given
	const cpf = "97456321558";
	// When
	const isValid = validateCpf(cpf);
	// Then
	expect(isValid).toBe(true);
});

it("should validate a CPF with zero as the second digit", () => {
	const cpf = "71428793860";

	const isValid = validateCpf(cpf);

	expect(isValid).toBe(true);
});

it("should validate a CPF with zero as the first digit", () => {
	const cpf = "87748248800";

	const isValid = validateCpf(cpf);

	expect(isValid).toBe(true);
});

it("should not validate a CPF with less 11 characters", () => {
	const cpf = "9745632155";

	const isValid = validateCpf(cpf);

	expect(isValid).toBe(false);
});

it("should not validate a CPF when all characters are the same", () => {
	const cpf = "11111111111";

	const isValid = validateCpf(cpf);

	expect(isValid).toBe(false);
});

it("should not validate a CPF with letters", () => {
	const cpf = "97a56321558";

	const isValid = validateCpf(cpf);

	expect(isValid).toBe(false);
});
