namespace StudyVerseBackend.Infastructure.Dependencies;

public interface IEnvService
{
    string? Get(string key);
}