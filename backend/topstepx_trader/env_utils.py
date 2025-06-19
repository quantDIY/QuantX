import os

def update_env_vars(new_vars: dict, env_path=".env"):
    # Read current lines, keeping comments and blank lines
    if os.path.exists(env_path):
        with open(env_path, "r") as file:
            lines = file.readlines()
    else:
        lines = []

    updated_keys = set(new_vars.keys())
    new_lines = []

    for line in lines:
        if "=" in line and not line.strip().startswith("#"):
            key, _ = line.strip().split("=", 1)
            if key in new_vars:
                # Replace with updated value
                val = new_vars.pop(key)
                new_lines.append(f'{key}="{val}"\n')
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)

    # Append any remaining new vars (not already present in file)
    for key, val in new_vars.items():
        new_lines.append(f'{key}="{val}"\n')

    # Write everything back
    with open(env_path, "w") as file:
        file.writelines(new_lines)
