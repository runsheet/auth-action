import * as core from '@actions/core'
import fetch from 'node-fetch'

const setOutput = ({ status, token, user }: any) => {
  const { username, repo } = user;

  core.setOutput('status', status);
  core.setOutput('token', token);
  core.setOutput('username', username);
  core.setOutput('repo', repo);
}

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const audience = core.getInput('audience');
    const idToken = await core.getIDToken(audience);
    const apiUrl = core.getInput('api_url') || 'https://auth.runsheet.dev/api/auth/token';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: idToken,
      }),
    })
    if (!response.ok) {
      throw new Error(`Failed to exchange token: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    setOutput(data);
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error))
  }
}