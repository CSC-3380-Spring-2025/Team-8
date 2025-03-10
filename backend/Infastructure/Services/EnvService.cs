namespace StudyVerseBackend.Infastructure.Dependencies;

public class EnvService : IEnvService
{
    public string? Get(string key)
    {
        return DotNetEnv.Env.GetString(key);
    }
}