import './style.css';

export function Login() {
	return (
		<form class="login-form">

      <div class="form-header">
        Welcome to Earth
      </div>

      <div class="form-hero">
        <img class="form-hero__image" src="key_world-0.png" />
        <div class="form-hero__text">
          Type a user name and password to log into Earth.
        </div>
      </div>

      <div class="form-field-text">
        <label class="form-field-text__label">
          User name:
          <input class="form-field-text__input" type="text" />
        </label>
      </div>

      <div class="form-field-text">
        <label class="form-field-text__label">
          Password:
          <input class="form-field-text__input" type="password" />
        </label>
      </div>

      <div class="form-field-checkbox">
        <label class="form-field-checkbox__label">
          Show password
          <input class="form-field-checkbox__input" type="checkbox" />
        </label>
      </div>

      <div class="form-actions">
        <button class="form-button" type="button">
          Forgot password
        </button>
        <button class="form-button form-button_default" type="submit">
          Log in
        </button>
      </div>

		</form>
	);
}
